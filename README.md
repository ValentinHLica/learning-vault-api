# Learning Vault REST API using NodeJS

## Configuration

### Searching

<p>The URL</p>

<http://localhost:5000/search/:query>

1. :query = Search Query

EXAMPLE: <http://localhost:5000/search/:javascript>

#### Response

```javascript
{
    "success": true,
    "count": 8,
    "data": [
        {
            "cover": "Course Cover",
            "title": "Course Title",
            "source": "Coruse Source",
            "link": "Get Course URL"
        }, ...
    ]
}
```

### Get Audiobook

<p>The URL</p>

<http://localhost:5000/course/:course>

1. :course = Course Url

EXAMPLE: <http://localhost:5000/course/react-nodejs-express-mongodb-the-mern-fullstack-guide>

#### Response

```javascript
{
    "success": true,
    "data": {
    "title": "Course Title",
    "cover": "Course Cover",
    "curriculum": [
        {
            "sectionCount": "Section Count",
            "sectionTitle": "Section Title",
            "lections": [
                {
                    "lectureVideo": "https://www.learningcrux.com/ + Leacture Video Src",
                    "info": {
                        "title": "Leacture Title",
                        "type": "Leacture Type",
                        "length": "Video Leacture Length"
                    }
                }, ...
            ]
        }, ...
    ]
}
}
```
