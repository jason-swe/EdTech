# EdTech Website

| Name |
|------|
|Mai Quốc Trung|
|Hồ Minh Quân|


## Reference prototype link of the project
https://www.figma.com/design/Vhar8OApW87BsZrcxlYYEn/EdTech?node-id=4-3&t=7Nu4tUawqNSl8kJ4-0

## Google Drive of pictures in project
UPDATING



# Members
| Email                      | Name             |
|----------------------------|------------------|
| maiqtrung13@gmail.com      | 	Mai Quốc Trung 	|
| quanho17082005@gmail.com   | 	Hồ Minh Quân |



# Links
- Prototype: https://www.figma.com/design/Vhar8OApW87BsZrcxlYYEn/EdTech?node-id=4-3&t=7Nu4tUawqNSl8kJ4-0
- Document: UPDATING




Tech Stack 
Frontend: React, UPDATING

Backend: Node.js + Express (Gemini proxy API)

Database: ...





# Features

TODO

# Installation

1. Install dependencies:
	npm install

2. Create env file:

	cp .env.example .env

	Set `GEMINI_API_KEY` inside `.env`.

3. Start backend API:

	npm run server:dev

4. Start frontend server:
	npm run dev

5. Build for production:
	npm run build


# Backend API

- Endpoint: `POST /api/ai/roadmap`
- Purpose: receive user form input, combine with your 8-level JSON schema, then ask Gemini to return structured JSON roadmap.
- Request body:

```json
{
	"userInput": {
		"goal": "Become frontend developer",
		"experienceYears": 1,
		"skills": ["html", "css"]
	},
	"levelSchema": {
		"levels": []
	},
	"options": {
		"model": "gemini-2.0-flash"
	}
}
```

- Response body:

```json
{
	"ok": true,
	"model": "gemini-2.0-flash",
	"data": {
		"recommendedLevel": "L3",
		"reasoning": [],
		"roadmap": []
	}
}
```
