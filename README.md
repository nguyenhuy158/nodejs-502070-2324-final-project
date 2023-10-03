# 2024 HK1 NodeJS

- [Word & Requirement](https://docs.google.com/document/d/18qz7kYLfw5KGSXSY8gE0WBfDcJHhPkkWN8lmfBqbEag/edit#heading=h.us8o10oowfcd)

- [Requirement](https://docs.google.com/document/d/13biAcC49Pkg3FuyOmL-IW5c5hTNQRvzO/edit)

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

    ## how to fix ip address don't access
    1. enter url [mongodb.com](https://mongodb.com/)
    2. copy DB_USERNAME and DB_PASSWORD in '.env' use to sign in
    3. in 'Security tab' select 'Network Access'
    4. click 'add current ip address'
    5. done
