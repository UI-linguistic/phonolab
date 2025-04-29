# API Reference

This section documents the API endpoints available in the PhonoLab backend.

## Lesson API

### Front-End

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lesson/` | Get all lessons |
| GET | `/lesson/<lesson_id>` | Get a lesson by ID |
| GET | `/lesson/vowel/<vowel_id>` | Get a lesson by vowel ID |

::: src.api.lesson
    options:
      show_root_heading: false
      show_symbol_type_heading: true
      show_symbol_type_toc: true
      show_source: true
      members: true
      heading_level: 3

## Quiz API

::: src.api.quiz
    options:
      show_root_heading: false
      show_symbol_type_heading: true
      show_symbol_type_toc: true
      show_source: true
      members: true
      heading_level: 3


<!-- ## User API

::: src.api.user
    options:
      show_root_heading: true
      show_symbol_type_heading: true
      show_symbol_type_toc: true
      show_source: true
      members: true
      heading_level: 3 -->
