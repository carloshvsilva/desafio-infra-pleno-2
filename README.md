<h1 align="center"> Desafio Infra Pleno 2</h1>

O obejtivo deste laboratório é a configuração de um ambiente para execução do aplicativo "desafio-infra-pleno-2".
A execução do aplicativo ocorrerá em um a
 

 # :hammer: Requisitos
 - Hashcorp Vagrant
    https://developer.hashicorp.com/vagrant/downloads
 - Virtual Box
    https://www.virtualbox.org/wiki/Downloads
    
  # :arrow_forward: Executando o projeto
 - Inicialmente vamos provisionar o servidor GLPI:
    - Abra o arquivo `Vagrantfile` e certifique que a variável `setInstall` está recebendo o valor `"server"`
    - Abra o console como administrador, acesse a pasta raiz do projeto e execute o comando: `vagrant up`
    - Ao finalizar a instalação é necessário ativar o modulo de inventário do GLPI:
        - Acesse: http://localhost/glpi ou http://192.168.100.140/glpi ou (ip designado para o servidor GLPI)/glpi
        - Insira usuário: glpi e senha: glpi e clique em "Entrar"
        - No menu lateral esquerdo clique sobre "Administração", e clique sobre "Inventário"
        - Marque a opção "Habilitar inventário" e clique em "Salvar" para salvar está alteração
 - Agora vamos provisionar os hosts que serão invetariádos pelo GLPI Inventory:
    - Abra o arquivo `Vagrantfile` e altere o valor da variável `setInstall` para `host`
    - Execute no console o comando: `vagrant up`
    - Aguarde o provisionamento dos hosts
 - Acesse o GLPI, no menu lateral esquerdo clique sobre "Ativos", e clique sobre "Computadores" para visualizar as informações dos hosts inventáriados.
 
 # :wrench: Descrição dos arquivos
 - `Vagrantfile`: provisiona cada máquina virtual, está pré configurado para provisionar um servidor GLPI e 3 hosts com agente GLPI Inventory.
    - A variável `list` guarda as listas de máquinas virtuais que serão provisionadas. Cada lista é constituida por:
        - "nome da máquina virtual" => {informações da máquina virtual}
        - As informações das máquinas virtuais são constituídas por:
            - `:type` tipo de máquina virtual, deve ser escolhido entre `server` (servidor GLPI) ou `host` (host com cliente do GLPI Inventory) 
            - `:so` nome do box contendo o S.O. da máquina virtual
            - `:ip` IP da máquina virtual
            - `:memory` quantidade de memória provisionada
            - `:cpu` quantidade de núcleos de CPU provisionados
            - `:script` local do script de instalação
    - A variável `setInstall` recebe qual tipo de máquina virtual será provisionada.
    - O parâmetro `each_with_index` percorre a lista de hosts.
    - A condição `if info[:type] == setInstall` controla qual tipo de host será provisionado.
    - A condição `if info[:type] == "server"` executa o `forward` de portas apenas para máquina virtuial do tipo `server`.

 - A pasta `scripts` contém os scripts que cada host executará para a instalação de componentes básicos para execução de seus serviços:
    - O script `scripts/server.sh` contém os comandos para download, configuração e instalação de componentes para funcionamento e execução do servidor GLPI.
    - Os demais scripts contêm os comandos necessários para download, configuração e instalação de componentes par funcionamento e execução do agente GLPI Inventory nas máquinas virtuais.
