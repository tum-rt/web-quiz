# Validate question files

## Installation
```sh
$ pip install -r requirements.txt
```

## Usage
```sh
$ python validate_question.py schema_static.yml ../example-quiz/
```

# Question format

## Glossary
We stress the difference between correctness of _questions_ and _question specification_.
* A _question_ is correct if it is correct mathematically and from the control engineering standpoint.
* A _question specification_ is correct if it complies to our data representation model.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED",  "MAY", and "OPTIONAL"
in this document are to be interpreted as described in
[RFC_2119](https://tools.ietf.org/html/rfc2119).

## Quiz questions

### File format
* Questions MUST be specified in YAML markup format.
* Question filename MUST match to `[!_]*.yml` pattern (`fnmatch`).
* File encoding MUST be UTF-8.
* Files MUST have exactly one empty newline at the end.
* Files MUST have LF (`\n`) line endings.
* Files SHALL NOT contain any hardtabs (`\t`).
* Files SHALL NOT contain any trailing whitespaces.
* For indentation, 4 whitespaces MUST be used.
  * It is indeed against the YAML tradition of 2 whitespaces for indentation,
    but Yamale seems to fail on nested dicts and lists in this case.
  * And @mp4096 likes it more this way.
