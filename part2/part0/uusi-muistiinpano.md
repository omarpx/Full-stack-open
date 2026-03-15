sequenceDiagram
    participant user as User (Käyttäjä)
    participant browser as Browser
    participant server as Server

    user->>browser: Kirjoittaa tekstikenttään ja painaa "Tallenna"
    
    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    Note right of server: Palvelin vastaanottaa uuden muistiinpanon datana { "content": "Uusi muistiinpano", "date": "2025-02-16" }
    server-->>browser: 302 Found (uudelleenohjaus /notes)
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server
    
    Note right of browser: Selain alkaa suorittaa JavaScript-koodia, joka hakee JSON-datan palvelimelta
    
    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "Uusi muistiinpano", "date": "2025-02-04" }, ... ]
    deactivate server
    
    Note right of browser: Selain suorittaa callback-funktion ja renderöi päivitetyt muistiinpanot käyttäjälle
