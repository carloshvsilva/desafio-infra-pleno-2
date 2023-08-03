<h1 align="center"> Desafio Infra Pleno 2</h1>

O obejtivo deste laboratório é a configuração de um ambiente para execução do aplicativo "desafio-infra-pleno-2".
O ambiente consiste em três containers:
 - `mongo-server` : Container executando banco de dados MongoDB
 - `app_server` : Container executando imagem NodeJS + aplicação "desafio-infra-pleno-2"
 - `proxy_server` : Container executando imagem NGINX configurado para receber as requisições da porta 80 dos host e redirecionar para a porta 3000 do `app-server`

 

 # :hammer: Requisitos
 Instaler os programas abaixo de acordo com a arquitetura e sistema operacional de seu equipamento.
 - Git
    https://github.com/git-guides/install-git
 - Docker
    https://docs.docker.com/engine/install/
 - Docker compose
    https://docs.docker.com/compose/install/
    
  # :arrow_forward: Executando o projeto
  - Realizar um clone deste repositório
    ```cmd
    git clone https://github.com/carloshvsilva/desafio-infra-pleno-2.git
    ```
  - Acessar a rais do repositório onde contém o arquivo `docker-compose.yml` e executar o Docker Compose
    ```cmd
    docker-compose up -d
    ```
    
 # :wrench: Descrição dos arquivos
 - `docker-compose.yml`: contém as informações para a criação dos containers necessários para o funcionamento do ambiente de execução da aplicação:
    - Criação de rede `weinnovate-net` em modo `bridge` 
     ```docker-compose
     networks:
       weinnovate-net:
         driver: bridge
     ```
   - Execução de container `mongo-server`, variáveis necessárias para execução, acesso do banco de dados, atribuição de rede
     ```docker-compose
     mongo_server:
      image: mongo:6.0.8
      container_name: mongo-server
      environment:
        - MONGO_INITDB_ROOT_USERNAME=weinnovate
        - MONGO_INITDB_ROOT_PASSWORD=weinnovate
      networks:
        - weinnovate-net
     ```
   - Execução de container ´app_server´, utilizando o arquivo de criação da imagem do NodeJS + aplicação, atribuição de rede e dependência do container `mongo-server`.
     - A aplicação faz a conexão para a porta 27017 do container `mongo-server`
     ```docker-compose
     app_server:
      build:
        context: .
        dockerfile: Dockerfile
      container_name: app_server
      networks:
        - weinnovate-net
      depends_on:
        - mongo_server
     ```
   - Execução de container `proxy_server`, port bind de porta 80 do host para porta 80 do container, volume para compartilhar arquivo de configuração do NGINX, atribuição de rede e depêdencia do container `app_server`
     ```docker-compose
     proxy_server:
       image: nginx:1.25.1
       container_name: proxy_server
       ports:
         - 80:80
       volumes:
         - ./nginx/:/etc/nginx/conf.d/
       networks:
         - weinnovate-net
       depends_on:
         - app_server
     ```
    
 - `Dockerfile`: contém arquivo de criação de imagem da aplicação contendo, utilização da imagem NodeJS, instalação de dependências do aplicativo, cópia dos arquivos de desenvolvimento do aplicativo, exposição da porta 3000 e execução do NodeJS
    ```Dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    RUN npm run build
    EXPOSE 3000
    CMD ["node", "dist/main.js"]
    ```
 - `nginx`: Pasta que contém o arquivo `default.conf` referente a configuração do NGINX para modo proxy
   - Realiza proxy das requisições recebidas pela porta 80 do container `proxy_server` e envia para a porta 3000 do container `app_server` 
     ```NGINX
     upstream appserver {
       server        app_server:3000;
     }
     
     server {
       listen        80;
       server_name  localhost;
     
       location / {
         proxy_pass  http://appserver;
       }
     }
     ```
- Demais arquivos são referente a aplicação
