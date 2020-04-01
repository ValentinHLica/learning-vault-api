# Learning Vault REST API using NodeJS

## Configuration

### Searching

<p>The URL</p>

<http://localhost:5000/search/:query?page=1&limit=10&paggination=true>

1. :query = Search Query
2. ?page = Current Page (default = 1)
3. ?limit = Search Results limit (default = 10)
4. ?paggination = Allow paggination => true, Get Every Search Result = false

EXAMPLE: <http://localhost:5000/search/javascript?page=2&limit=2>

#### Response

```javascript
{
    "success": true,
    "count": 8,
    "paggiantion": {
        "limit": 2,
        "prevPage": 1,
        "nextPage":3
    },
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

<http://localhost:5000/course/:course?sort=false>

1. :course = Course Url
2. ?sort = Sort Leactures in Sections (default = true)

EXAMPLE: <http://localhost:5000/course/react-nodejs-express-mongodb-the-mern-fullstack-guide?sort=true>

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
