"use strict";
const Bluebird = require("bluebird");
const fs = Bluebird.promisifyAll(require("fs"));
const crypto = require("crypto");
const mkdirp = Bluebird.promisify(require("mkdirp"));
const YAML = require("yamljs");
const path = require("path");
const SVGO = require("svgo");
const svgo = new SVGO();
const glob = require("glob").glob;
const prerender = require("./prerender").prerender;
const shuffle = require("./prerender").shuffle;
const jsend = require("./jsend");
const fixSvgSize = require("./svg-size-fix");
const fixSvgColor = require("./svg-color-fix");

// do heavy initialization as early as possible
const mathjax = require("mathjax-node/lib/mj-single.js");
mathjax.start();

module.exports = (app) => {
    const rootDir = process.env.NODE_ENV === "test" ?
        path.join(__dirname, "..", "example-quiz") : process.argv[2];
    const questions = [];
    const tagsSet = new Set();

    const config = YAML.parse(fs.readFileSync(path.join(rootDir, "_config.yml"), "utf8"));

    const files = glob.sync("/**/!(_)*.yml", {root: rootDir, nodir: true});
    for(var file of files) {
        const question = YAML.parse(fs.readFileSync(file, "utf8"));
        for(var tag of question.tags) {
            tagsSet.add(tag);
        }
        questions.push(question);
    }

    const tags = Array.from(tagsSet).sort();

    function getQuestionsByTags(tags) {
        return questions.filter((q) =>
            tags.every((tag) => q.tags.indexOf(tag) !== -1));
    }

    app.get("/", (req, res) => {
        res.render("index", {config});
    });

    app.get("/favicon.png", (req, res) => {
        res.sendFile("favicon.png", {root: rootDir});
    });

    app.get("/api/config", (req, res) => {
        res.setHeader("Content-Type", "application/javascript");
        res.send("var QUIZ = " + JSON.stringify(config) + ";");
    });

    /**
     * @api {get} /api/tags Get all tags
     * @apiGroup WebQuiz
     * @apiName GetTags
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {String[]} data List of all tags, sorted alphabetically (case-sensitive)
     */
    app.get("/api/tags", (req, res) => {
        jsend(res).success(tags);
    });

    /**
     * @api {get} /api/count_questions Count questions matching tags
     * @apiGroup WebQuiz
     * @apiName CountQuestions
     *
     * @apiParam {String[]} tags List of tags, separated by "|"; if list is
     *      empty, the number of all questions will be returned
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Number} data number of questions matching to given tags
     */
    app.get("/api/count_questions", (req, res) => {
        const filterTags = req.query.tags ? req.query.tags.split("|") : [];
        var counter = getQuestionsByTags(filterTags).length;
        jsend(res).success(counter);
    });

    /**
     * @api {get} /api/tags_with_count Count questions for each tag
     * @apiGroup WebQuiz
     * @apiName TagsWithCount
     *
     * @apiParam {String[]} tags List of tags, separated by "|"; if list is
     *     empty, no additional filtering is applied
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object} data
     * @apiSuccess {Number} data.total
     * @apiSuccess {Object[]} data.tags List of (Tag,Count) pairs, sorted
     *     by tag name
     * @apiSuccess {String} data.tags.tag Tag
     * @apiSuccess {Number} data.tags.count Number of questions that have
     *     this tag and all tags given in parameter `tags`
     */
    app.get("/api/tags_with_count", (req, res) => {
        const filterTags = req.query.tags ? req.query.tags.split("|") : [];
        jsend(res).success({
            tags: tags.map((tag) => {
                return {
                    tag,
                    count: getQuestionsByTags(filterTags.concat([tag])).length
                };
            }),
            total: getQuestionsByTags(filterTags).length
        });
    });

    /**
     * @api {get} /api/quiz Generate quiz
     * @apiGroup WebQuiz
     * @apiName GenerateQuiz
     *
     * @apiParam {String[]} tags List of tags to filter by, separated by "|";
     *      if list is empty, no filtering is applied
     *
     * @apiSuccess {String} status "success"
     * @apiSuccess {Object[]} data list of questions (at most MAX_QUESTIONS_PER_SESSION, currently 10)
     */
    app.get("/api/quiz", (req, res) => {
        const filterTags = req.query.tags ? req.query.tags.split("|") : [];
        const result = getQuestionsByTags(filterTags);

        shuffle(result);

        const MAX_QUESTIONS_PER_SESSION = config.max_questions_per_session || 10;

        jsend(res).success(result.slice(0,MAX_QUESTIONS_PER_SESSION).map(prerender));
    });

    /**
     * @api {get} /api/math/tex/svg Render LaTeX math to SVG
     * @apiGroup WebQuiz
     * @apiName RenderTexMath
     *
     * @apiParam {String} input Tex math (usually what you find between $ and $)
     *
     * @apiSuccess {SVG} Content rendered svg as "image/svg+xml"
     */
    app.get("/api/math/tex/svg", (req, res) => {
        if(typeof req.query.input === "undefined") {
            jsend(res).fail({input: "required"});
            return;
        }
        const input = "" + req.query.input;
        if(input === "") {
            jsend(res).fail({input: "must not be empty"});
            return;
        }
        const MAX_INPUT_LEN = 1000;
        if(input.length > MAX_INPUT_LEN) {
            jsend(res).fail({input: `too long. max ${MAX_INPUT_LEN} chars`});
            return;
        }

        const hash = crypto.createHash("sha256");
        hash.update(input);
        const hexDigest = hash.digest("hex");
        const folderpath = path.join(rootDir, ".cache", hexDigest.slice(0, 2));
        const filename = hexDigest.slice(2) + ".svg";

        res.sendFile(filename, {root: folderpath}, (err) => {
            if(!err) {
                // sending file was successful
                return;
            }

            mkdirp(folderpath)
            .then(() => {
                // Cache miss -> Generate SVG from TeX
                return new Bluebird((resolve, reject) => {
                    mathjax.typeset({
                        math: input,
                        format: "TeX",
                        svg: true
                    }, function (data) {
                        if(data.errors) {
                            reject(data.errors);
                        } else {
                            resolve(data.svg);
                        }
                    });
                });
            }).then((svg) => {
                const EX_IN_PIXEL = 8;
                return fixSvgSize(svg, EX_IN_PIXEL);
            }).then((svg) => {
                return fixSvgColor(svg);
            }).then((svg) => {
                return new Bluebird((resolve, reject) => {
                    svgo.optimize(svg, function(result) {
                        resolve(result.data);
                    });
                });
            }).then((svg) => {
                // save SVG to cache file
                return fs.writeFileAsync(path.join(folderpath, filename), svg);
            }).then(() => {
                res.sendFile(filename, {root: folderpath});
            }).catch((err) => {
                jsend(res).error("MathJax failed");
            });
        });
    });
};
