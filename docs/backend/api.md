# API Reference

This section documents the API endpoints available in the PhonoLab backend.

## Lesson API {: .toc-only }

### Front-End {: .toc-only }

<div markdown="1" class="center-table">

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/lesson/` | Get all lessons |
| GET | `/lesson/<lesson_id>` | Get a lesson by ID |
| GET | `/lesson/vowel/<vowel_id>` | Get a lesson by vowel ID |
| GET | `/quiz/` | Get all quiz items |
| GET | `/quiz/<quiz_id>` | Get a quiz item by ID |
| GET | `/quiz/vowel/<vowel_id>` | Get all quiz items for a specific vowel |

</div>

::: src.api.lesson
    handler: python
    options:
      show_root_heading: true
      show_root_full_path: false
      show_symbol_type_toc: true
      show_symbol_type_heading: true
      docstring_style: google
      docstring_section_style: table
      show_signature: false

### Response Formats

#### Success Response

??? success "Success Response Format"
    ```json
    {
      "success": true,
      "message": "Operation completed successfully",
      "data": {
        // Operation-specific data
      }
    }
    ```

#### Error Response

??? failure "Error Response Format"
    ```json
    {
      "status": "error",
      "message": "Error message describing what went wrong",
      "error": {
        "code": 404,
        "details": "Additional error details if available"
      }
    }
    ```

#### Data

??? example "Lesson Object Format"
    ```json
    {
      "id": 1,
      "vowel": {
        "id": "v1",
        "phoneme": "i",
        "name": "Long E",
        "ipa_example": "iː",
        "color_code": "#FF5733",
        "audio_url": "/audio/vowels/long_e.mp3",
        "description": "The long E vowel sound",
        "mouth_image_url": "/images/mouth/long_e.png"
      },
      "lesson_card": {
        "pronounced": "as 'ee' in 'see'",
        "common_spellings": ["ee", "ea", "e", "ie", "ei"],
        "lips": "Spread wide",
        "tongue": "High and forward in the mouth",
        "example_words": [
          {"word": "see", "ipa": "siː"},
          {"word": "meet", "ipa": "miːt"},
          {"word": "piece", "ipa": "piːs"}
        ]
      }
    }
    ```

## Quiz API {: .toc-only }

::: src.api.quiz
    handler: python
    options:
      show_root_heading: true
      show_root_full_path: false
      show_symbol_type_toc: true
      show_symbol_type_heading: true
      docstring_style: google
      docstring_section_style: table
      show_signature: false

### Response Formats

#### Success Response

??? success "Success Response Format"
    ```json
    {
      "success": true,
      "message": "Operation completed successfully",
      "data": {
        // Operation-specific data
      }
    }
    ```

#### Error Response

??? failure "Error Response Format"
    ```json
    {
      "status": "error",
      "message": "Error message describing what went wrong",
      "error": {
        "code": 404,
        "details": "Additional error details if available"
      }
    }
    ```

#### Data

??? example "Quiz Item Object Format"
    ```json
    {
      "id": 1,
      "prompt_word": "sheep",
      "prompt_ipa": "ʃiːp",
      "prompt_audio_url": "/audio/quiz/sheep.mp3",
      "feedback_correct": "Great job! You identified the correct vowel sound.",
      "feedback_incorrect": "Not quite. Listen to the difference again.",
      "options": [
        {
          "id": 1,
          "word": "ship",
          "ipa": "ʃɪp",
          "audio_url": "/audio/quiz/ship.mp3",
          "is_correct": false,
          "language": "en"
        },
        {
          "id": 2,
          "word": "sheep",
          "ipa": "ʃiːp",
          "audio_url": "/audio/quiz/sheep.mp3",
          "is_correct": true,
          "language": "en"
        }
      ]
    }
    ```