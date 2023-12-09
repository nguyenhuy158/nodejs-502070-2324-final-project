<!-- vscode-markdown-toc -->
* [Getting Started](#GettingStarted)
	* [Pre-requisites](#Pre-requisites)
	* [Installation](#Installation)
* [Deployment](#Deployment)
* [Account](#Account)
	* [Database Account Deploy](#DatabaseAccountDeploy)
	* [Default Account Admin Login Website](#DefaultAccountAdminLoginWebsite)
* [Other](#Other)
* [Member Information](#MemberInformation)
* [Status Code](#StatusCode)
* [How To Build Tree Project](#HowToBuildTreeProject)

<!-- vscode-markdown-toc-config
	numbering=false
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc --># 2024 HK1 NodeJS

-   [Word & Requirement](https://docs.google.com/document/d/18qz7kYLfw5KGSXSY8gE0WBfDcJHhPkkWN8lmfBqbEag/edit#heading=h.us8o10oowfcd)

-   [Requirement](https://docs.google.com/document/d/13biAcC49Pkg3FuyOmL-IW5c5hTNQRvzO/edit)

## <a name='GettingStarted'></a>Getting Started

### <a name='Pre-requisites'></a>Pre-requisites

1. Node.js version 18.18.0 or largest is required. You can download it from [Node.js Official Website.](https://nodejs.org/en/).

2. Yarn version 1.22.19 is required. You can install it using the following command:

    ```bash
    npm install -g yarn
    ```

3. A network connection is required because the database project uses is the online mongoDB URI.

### <a name='Installation'></a>Installation

1. Clone the repository:
    ```bash
    git clone https://gitlab.duthu.net/S52000668/nodejs-502070-2324-final-project
    ```
    // or
    ```bash
    git clone https://github.com/nguyenhuy158/nodejs-502070-2324-final-project
    ```
2. Change to the project directory:
    ```bash
    cd nodejs-502070-2324-final-project/
    ```
3. Install project dependencies:
    ```bash
    yarn
    ```
4. Build and run the project:
    ```bash
    yarn dev
    ```
5. Open a web browser and navigate to http://localhost:8080 to access the local development version of the website.

## <a name='Deployment'></a>Deployment

**Note**:

-   _Make sure you are using github remote_.
-   _Deploy account [clickhere](#databaseaccountdeploy)_

To deploy your changes to the server (onrender.com):

1. Make code changes in the `nodejs-502070-2324-final-project` folder.

2. Push your code to the `main` branch, and the server onrender.com will automatically deploy the updated code.

3. Access the dashboard (view log, deploy process, ..) at https://dashboard.render.com/.

4. Access the deployed website at http://tech-hut.onrender.com/.

## <a name='Account'></a>Account

### <a name='DatabaseAccountDeploy'></a>Database Account Deploy

```
USERNAME = noreplay.nodejs.502070@gmail.com
PASSWORD = noreplay.nodejs.502070
```

### <a name='DefaultAccountAdminLoginWebsite'></a>Default Account Admin Login Website

```
USERNAME: admin
PASSWORD: admin
```

## <a name='Other'></a>Other

## <a name='MemberInformation'></a>Member Information

| MSSV     | Full Name             |
| -------- | --------------------- |
| 52000630 | Luong Gia Bao         |
| 52000626 | Pham Quoc Anh         |
| 52000668 | Nguyen Tran Quang Huy |

## <a name='StatusCode'></a>Status Code

| code | explain               |
| ---- | --------------------- |
| 200  | ok                    |
| 201  | created               |
| 301  | redirect              |
| 400  | bad request           |
| 401  | unauthorized          |
| 403  | forbidden             |
| 404  | not found             |
| 500  | internal server error |
| 503  | service unavailable   |

## <a name='HowToBuildTreeProject'></a>How To Build Tree Project

```
- command export tree.txt
tree -F -a -I 'node_modules|.git' -o tree-full.txt
tree -d -F -a -I 'node_modules|.git' -o tree-only-directory.txt
```
