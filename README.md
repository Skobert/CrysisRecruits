# CrysisRecruits

## Architecture

### Logical Architecture

![](doc/img/crysis%20recruitbot%20arch-Logical.jpg)

### Physical Infrastructure Architecture

![](doc/img/crysis%20recruitbot%20arch-SVC%20Physical.jpg)

### Cron Service Components

![](doc/img/crysis%20recruitbot%20arch-SVC%20Component.jpg)

### Discord Bot Components
![](doc/img/crysis%20recruitbot%20arch-Bot%20Component.jpg)


## Lambda Config

To set up google sheets:
- Set up an account in google cloud platform
- Enable the Google Sheets API
- Follow this: https://medium.com/tech-prescient/integrating-google-sheets-with-node-using-api-ae043d89b385



To set up environment variables locally, add a .env file to the root folder. .gitignore will take care of ignoring it.\
Format of the .env file is always \
`KEY1=value1`\
`KEY2=value2`\
Each key separated by newline.

**Environment Variables:**
| Env Var | Description |
| ------- | ----------- |
| ENVIRONMENT | 'production' for production environment, any other for down-level environment. See: [./lambda/integration/gow.mjs](./lambda/integration/gow.mjs) |
| SCRAPENINJA_API_KEY | API key for ScrapeNinja; get this from RapidAPI website |
| SHEETS_API_KEY | Google Sheets API Key |
| SHEETID | ID of the Google Sheets doc hosting recruit data |
| SHEETS_PRIVATE_KEY | Private Key data for the service account in google APIs (NOTE: MUST BE IN DOUBLE QUOTES "") |
| SHEETS_PRIVATE_KEY_ID | ID of the private key. Taken from the JSON file Google gives when making a key for the service acct |
| SHEETS_CLIENT_EMAIL | Client email of the service account for Google Sheets |
| SHEETS_CLIENT_ID | Client ID of the service account for Google Sheets |

## Bot Config

**Environment Variables:**
| Env Var | Description |
| ------- | ----------- |
| | |