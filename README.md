# 2024 HK1 NodeJS

-   [Word & Requirement](https://docs.google.com/document/d/18qz7kYLfw5KGSXSY8gE0WBfDcJHhPkkWN8lmfBqbEag/edit#heading=h.us8o10oowfcd)

-   [Requirement](https://docs.google.com/document/d/13biAcC49Pkg3FuyOmL-IW5c5hTNQRvzO/edit)

```
- command export tree.txt
tree -F -a -I 'node_modules|.git' -o tree-full.txt
tree -d -F -a -I 'node_modules|.git' -o tree-only-directory.txt
```

## how to run project

```
// cmd && git bash
npm install -g yarn && yarn install && yarn start
```

## convert html to pug

[html2pug](https://html-to-pug.com/)

## Securing MongoDB Access by IP

To secure your MongoDB database and restrict access to specific IP addresses:

1. Visit mongodb.com.
2. Log in using the credentials from your .env file (DB_USERNAME and DB_PASSWORD).
3. In the 'Security' tab, choose 'Network Access'.
4. Click 'Add IP Address' to specify allowed IP addresses.
5. Enter the desired IPs or CIDR blocks and save.

Now, only approved IP addresses can access your MongoDB database, enhancing its security.

<!-- Member information -->

## Member information

1. 52000630 - Luong Gia Bao
2. 52000626 - Pham Quoc Anh
3. 52000668 - Nguyen Tran Quang Huy

## nodemon config

```
    "nodemonConfig": {
        "verbose": true,
        "ext": "js,mjs,cjs,json,pug,css,html,env,sass,scss",
        "ignore": "**/node_module/**"
    },
```

## place holder image

`https://placehold.co/200?text=Empty&font=roboto`

## default account admin login

```
username: admin
password: admin
```

## simple flash message

```
flash.addFlashMessage(req, 'success', 'Success', 'message success flash');
flash.addFlashMessage(req, 'warning', 'Error', 'message error flash');
```

[//]: # 'https://chat.openai.com/share/f4645e84-8141-44bd-b9a5-aa4235dd2bab'

### Jquery plug in

| Name           | website                        |
| -------------- | ------------------------------ |
| jQuery UI      |                                |
| DataTables     |                                |
| Slick          |                                |
| Magnific Popup |                                |
| Select2        |                                |
| Chosen         |                                |
| Owl Carousel   |                                |
| Lazy Load      | http://jquery.eisbehr.de/lazy/ |
| Select2        |                                |
| Select2        |                                |

## Force restart nodemon

```
npm install -g nodemon     # Install nodemon globally if not already done
pkill -f nodemon           # Stop nodemon (use a different command if you're not on Unix-like systems)
rm -rf .nodemon-cache      # Delete the nodemon cache
nodemon                     # Restart nodemon
```
