# Pilha elástica (ELK) no Docker

[![Versão da pilha elástica](https://img.shields.io/badge/Elastic%20Stack-8.17.0-00bfb3?style=flat&logo=elastic-stack)](https://www.elastic.co/blog/category/releases)
[![Status da compilação](https://github.com/deviantony/docker-elk/workflows/CI/badge.svg?branch=main)](https://github.com/deviantony/docker-elk/actions?query=workflow%3ACI+branch%3Amain)
[![Junte-se ao chat](https://badges.gitter.im/Join%20Chat.svg)](https://app.gitter.im/#/room/#deviantony_docker-elk:gitter.im)

Execute a versão mais recente do [Elastic stack][elk-stack] com Docker e Docker Compose.

Ele oferece a capacidade de analisar qualquer conjunto de dados usando os recursos de pesquisa/agregação do Elasticsearch e o poder de visualização do Kibana.

Com base nas [imagens oficiais do Docker][elastic-docker] da Elastic:

* [Elasticsearch](https://github.com/elastic/elasticsearch/tree/main/distribution/docker)
* [Logstash](https://github.com/elastic/logstash/tree/main/docker)
* [Kibana](https://github.com/elastic/kibana/tree/main/src/dev/build/tasks/os_packages/docker_generator)

Outras variantes de pilha disponíveis:

* [`tls`](https://github.com/deviantony/docker-elk/tree/tls): Criptografia TLS habilitada no Elasticsearch, Kibana (opt in),
e Fleet

> [!IMPORTANTE]
> Os recursos [Platinum][subscriptions] são habilitados por padrão para uma duração de [trial][license-mngmt] de **30 dias**. Após esse período de avaliação, você manterá o acesso a todos os recursos gratuitos incluídos na licença Open Basic perfeitamente, sem necessidade de intervenção manual e sem perder nenhum dado. Consulte a seção [Como desabilitar recursos pagos](#how-to-disable-paid-features) para cancelar esse comportamento.

---

## tl;dr

```sh
docker compose up setup
```

```sh
docker compose up
```

<picture>
<source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/6f67cbc0-ddee-44bf-8f4d-7fd2d70f5217">
<img alt="Demonstração animada" src="https://github.com/user-attachments/assets/501a340a-e6df-4934-90a2-6152b462c14a">
</picture>

---

## Filosofia

Nosso objetivo é fornecer a entrada mais simples possível na pilha Elastic para qualquer pessoa que queira experimentar essa poderosa combinação de tecnologias. A configuração padrão deste projeto é propositalmente mínima e imparcial. Ele não depende de nenhuma dependência externa e usa o mínimo de automação personalizada necessário para fazer as coisas funcionarem.

Em vez disso, acreditamos em uma boa documentação para que você possa usar este repositório como um modelo, ajustá-lo e torná-lo _seu_. [sherifabdlnaby/elastdocker][elastdocker] é um exemplo entre outros de projeto que se baseia nessa ideia.

---

## Conteúdo

1. [Requisitos](#requirements)
* [Configuração do host](#host-setup)
* [Docker Desktop](#docker-desktop)
* [Windows](#windows)
* [macOS](#macos)
1. [Uso](#usage)
* [Trazendo a pilha](#trazendo-a-pilha)
* [Configuração inicial](#initial-setup)
* [Configurando a autenticação do usuário](#setting-up-user-authentication)
* [Injetando dados](#injecting-data)
* [Limpeza](#cleanup)
* [Seleção da versão](#version-selection)
1. [Configuração](#configuration)
* [Como configurar o Elasticsearch](#how-to-configure-elasticsearch)
* [Como configurar Kibana](#how-to-configure-kibana)
* [Como configurar o Logstash](#how-to-configure-logstash)
* [Como desabilitar recursos pagos](#how-to-disable-paid-features)
* [Como escalar o cluster Elasticsearch](#how-to-scale-out-the-elasticsearch-cluster)
* [Como reexecutar a configuração](#how-to-re-execute-the-setup)
* [Como redefinir uma senha programaticamente](#how-to-reset-a-password-programmatically)
1. [Extensibilidade](#extensibilidade)
* [Como adicionar plugins](#how-to-add-plugins)
* [Como habilitar as extensões fornecidas](#how-to-enable-the-provided-extensions)
1. [Ajuste de JVM](#jvm-tuning)
* [Como especificar a quantidade de memória usada por um serviço](#como-especificar-a-quantidade-de-memória-usada-por-um-serviço)
* [Como habilitar uma conexão JMX remota a um serviço](#como-habilitar-uma-conexão-JMX-remota-a-um-serviço)
1. [Indo além](#indo-além)
* [Plugins e integrações](#plugins-e-integrações)

## Requisitos

### Configuração do host

* [Docker Engine][docker-install] versão **18.06.0** ou mais recente
* [Docker Compose][compose-install] versão **2.0.0** ou mais recente
* 1,5 GB de RAM

> [!NOTA]
> Especialmente no Linux, certifique-se de que seu usuário tenha as [permissões necessárias][linux-postinstall] para interagir com o daemon do Docker.

Por padrão, a pilha expõe as seguintes portas:

* 5044: entrada Logstash Beats
* 50000: entrada Logstash TCP
* 9600: API de monitoramento Logstash
* 9200: Elasticsearch HTTP
* 9300: transporte Elasticsearch TCP
* 5601: Kibana

> [!AVISO]
> As [verificações bootstrap][bootstrap-checks] do Elasticsearch foram desabilitadas propositalmente para facilitar a configuração da pilha Elastic em ambientes de desenvolvimento. Para configurações de produção, recomendamos que os usuários configurem seu host de acordo com as instruções da documentação do Elasticsearch: [Configuração importante do sistema][es-sys-config].

### Docker Desktop

#### Windows

Se você estiver usando o modo Hyper-V legado do _Docker Desktop para Windows_, certifique-se de que [Compartilhamento de arquivos][win-filesharing] esteja habilitado para a unidade `C:`.

#### macOS

A configuração padrão do _Docker Desktop para Mac_ permite montar arquivos de `/Users/`, `/Volume/`, `/private/`, `/tmp` e `/var/folders` exclusivamente. Certifique-se de que o repositório esteja clonado em um desses locais ou siga as instruções da [documentação][mac-filesharing] para adicionar mais locais.

## Uso

> [!AVISO]
> Você deve reconstruir as imagens da pilha com `docker compose build` sempre que alternar o branch ou atualizar a [versão](#version-selection) de uma pilha já existente.

### Ativando a pilha

Clone este repositório no host do Docker que executará a pilha com o comando abaixo:

```sh
git clone https://github.com/deviantony/docker-elk.git
```

Em seguida, inicialize os usuários e grupos do Elasticsearch necessários para o docker-elk executando o comando:

```sh
docker compose up setup
```

Se tudo correu bem e a configuração foi concluída sem erros, inicie os outros componentes da pilha:

```sh
docker compose up
```

> [!NOTA]
> Você também pode executar todos os serviços em segundo plano (modo desanexado) anexando o sinalizador `-d` ao comando acima.

Dê ao Kibana cerca de um minuto para inicializar, então acesse a interface de usuário da web do Kibana abrindo <http://localhost:5601> em um navegador da web e use as seguintes credenciais (padrão) para efetuar login:

* usuário: *elastic*
* senha: *changeme*

> [!NOTA]
> Na inicialização, os usuários do Elasticsearch `elastic`, `logstash_internal` e `kibana_system` são inicializados com os valores das senhas definidas no arquivo .env (_"changeme"_ por padrão). O primeiro é o [superusuário integrado][builtin-users], os outros dois são usados ​​pelo Kibana e Logstash respectivamente para se comunicar com o Elasticsearch. Esta tarefa é realizada somente durante a inicialização (docker compose up setup). Para alterar as senhas dos usuários _após_ eles terem sido inicializados, consulte as instruções na próxima seção.

### Configuração inicial

#### Configurando a autenticação do usuário

> [!NOTA]
> Consulte [Configurações de segurança no Elasticsearch][es-security] para desabilitar a autenticação.

> [!AVISO]
> A partir do Elastic v8.0.0, não é mais possível executar o Kibana usando o usuário privilegiado bootstrapped `elastic`.

A senha _"changeme"_ definida por padrão para todos os usuários mencionados acima é **insegura**. Para maior segurança, redefiniremos as senhas de todos os usuários do Elasticsearch mencionados acima para segredos aleatórios.

1. Redefinir senhas para usuários padrão

Os comandos abaixo redefinem as senhas dos usuários `elastic`, `logstash_internal` e `kibana_system`. Anote-as.

```sh
docker compose exec elasticsearch bin/elasticsearch-reset-password --batch --user elastic
```

```sh
docker compose exec elasticsearch bin/elasticsearch-reset-password --batch --user logstash_internal
```

```sh
docker compose exec elasticsearch bin/elasticsearch-reset-password --batch --user kibana_system
```

Se for necessário (por exemplo, se você quiser [coletar informações de monitoramento][ls-monitoring] por meio do Beats e outros componentes), sinta-se à vontade para repetir esta operação a qualquer momento para o restante dos [usuários internos][usuários internos].

1. Substitua nomes de usuários e senhas em arquivos de configuração

Substitua a senha do usuário `elastic` dentro do arquivo `.env` pela senha gerada na etapa anterior. Seu valor não é usado por nenhum componente principal, mas [extensões](#como-habilitar-as-extensões-fornecidas) o usam para se conectar ao Elasticsearch.

> [!NOTA]
> Caso você não planeje usar nenhuma das [extensões](#como-habilitar-as-extensões-fornecidas) fornecidas, ou prefira criar suas próprias funções e usuários para autenticar esses serviços, é seguro remover a entrada `ELASTIC_PASSWORD` do arquivo `.env` completamente após a pilha ter sido inicializada.

Substitua a senha do usuário `logstash_internal` dentro do arquivo `.env` pela senha gerada na etapa anterior. Seu valor é referenciado dentro do arquivo de pipeline do Logstash (`logstash/pipeline/logstash.conf`).

Substitua a senha do usuário `kibana_system` dentro do arquivo `.env` pela senha gerada na etapa anterior. Seu valor é referenciado dentro do arquivo de configuração do Kibana (`kibana/config/kibana.yml`).

Veja a seção [Configuração](#configuration) abaixo para mais informações sobre esses arquivos de configuração.

1. Reinicie o Logstash e o Kibana para reconectar-se ao Elasticsearch usando as novas senhas

```sh
docker compose up -d logstash kibana
```

> [!NOTA]
> Aprenda mais sobre a segurança da pilha Elastic em [Proteja a pilha Elastic][sec-cluster].

#### Injetando dados

Inicie a interface de usuário da web do Kibana abrindo <http://localhost:5601> em um navegador da web e use as seguintes credenciais para efetuar login:

* usuário: *elastic*
* senha: *changeme*

Agora que a pilha está totalmente configurada, você pode prosseguir e injetar algumas entradas de log.

A configuração do Logstash enviada permite que você envie dados pela porta TCP 50000. Por exemplo, você pode usar um dos seguintes comandos — dependendo da sua versão instalada do `nc` (Netcat) — para ingerir o conteúdo do arquivo de log `/path/to/logfile.log` no Elasticsearch, via Logstash:

```sh
# Execute `nc -h` para determinar sua versão do `nc`

cat /path/to/logfile.log | nc -q0 localhost 50000 # BSD
cat /path/to/logfile.log | nc -c localhost 50000 # GNU
cat /path/to/logfile.log | nc --send-only localhost 50000 # nmap
```

Você também pode carregar os dados de amostra fornecidos pela sua instalação do Kibana.

### Limpeza

Os dados do Elasticsearch são persistidos dentro de um volume por padrão.

Para desligar completamente a pilha e remover todos os dados persistidos, use o seguinte comando Docker Compose:

```sh
docker compose down -v
```

### Seleção de versão

Este repositório permanece alinhado com a versão mais recente da pilha Elastic. A ramificação `main` rastreia a versão principal atual (8.x).

Para usar uma versão diferente dos principais componentes Elastic, basta alterar o número da versão dentro do arquivo [`.env`](.env). Se você estiver atualizando uma pilha existente, lembre-se de reconstruir todas as imagens de contêiner usando o comando `docker compose build`.

> [!IMPORTANTE]
> Sempre preste atenção às [instruções oficiais de atualização][upgrade] para cada componente individual antes de executar uma atualização de pilha.

Versões principais mais antigas também são suportadas em ramificações separadas:

* [`release-7.x`](https://github.com/deviantony/docker-elk/tree/release-7.x): série 7.x
* [`release-6.x`](https://github.com/deviantony/docker-elk/tree/release-6.x): série 6.x (fim da vida útil)
* [`release-5.x`](https://github.com/deviantony/docker-elk/tree/release-5.x): série 5.x (fim da vida útil)

## Configuração

> [!IMPORTANTE]
> A configuração não é recarregada dinamicamente, você precisará reiniciar componentes individuais após qualquer alteração de configuração.

### Como configurar o Elasticsearch

A configuração do Elasticsearch é armazenada em [`elasticsearch/config/elasticsearch.yml`][config-es].

Você também pode especificar as opções que deseja substituir definindo variáveis ​​de ambiente dentro do arquivo Compose:

```yml
elasticsearch:

environment:
network.host: _non_loopback_
cluster.name: my-cluster
```

Consulte a seguinte página de documentação para obter mais detalhes sobre como configurar o Elasticsearch dentro de contêineres Docker: [Instalar o Elasticsearch com Docker][es-docker].

### Como configurar o Kibana

A configuração padrão do Kibana é armazenada em [`kibana/config/kibana.yml`][config-kbn].

Você também pode especificar as opções que deseja substituir definindo variáveis ​​de ambiente dentro do arquivo Compose:

```yml
kibana:

environment:
SERVER_NAME: kibana.example.org
```

Consulte a seguinte página de documentação para obter mais detalhes sobre como configurar o Kibana dentro de contêineres Docker: [Instalar o Kibana com Docker][kbn-docker].

### Como configurar o Logstash

A configuração do Logstash é armazenada em [`logstash/config/logstash.yml`][config-ls].

Você também pode especificar as opções que deseja substituir definindo variáveis ​​de ambiente dentro do arquivo Compose:

```yml
logstash:

environment:
LOG_LEVEL: debug
```

Consulte a seguinte página de documentação para obter mais detalhes sobre como configurar o Logstash dentro de contêineres do Docker: [Configurando o Logstash para Docker][ls-docker].

### Como desabilitar recursos pagos

Você pode cancelar uma avaliação em andamento antes da data de expiração — e, assim, reverter para uma licença básica — no painel [License Management][license-mngmt] do Kibana ou usando o `start_basic` [API de licenciamento][license-apis] do Elasticsearch. Observe que a segunda opção é a única maneira de recuperar o acesso ao Kibana se a licença não for alterada para `básica` ou atualizada antes da data de expiração do teste.

Alterar o tipo de licença alterando o valor da configuração `xpack.license.self_generated.type` do Elasticsearch de `trial` para `basic` (consulte [Configurações da licença][configurações-de-licença]) só funcionará **se feito antes da configuração inicial.** Após o início de um teste, a perda de recursos de `trial` para `basic` _deve_ ser reconhecida usando um dos dois métodos descritos no primeiro parágrafo.

### Como escalar o cluster Elasticsearch

Siga as instruções do Wiki: [Escalando o Elasticsearch](https://github.com/deviantony/docker-elk/wiki/Elasticsearch-cluster)

### Como reexecutar a configuração

Para executar o contêiner de configuração novamente e reinicializar todos os usuários para os quais uma senha foi definida dentro do arquivo `.env`, simplesmente "up" o serviço Compose `setup` novamente:

```console
$ docker compose up setup                                                                                                                                           0.4s
 ✔ Network docker-elk_elk                Created                                                                                                                                           0.4s
 ✔ Volume "docker-elk_elasticsearch"     Created                                                                                                                                           0.0s
 ✔ Container docker-elk-elasticsearch-1  Created                                                                                                                                           3.4s
 ✔ Container docker-elk-setup-1          Created                                                                                                                                           1.4s
Attaching to setup-1
setup-1  | [+] Waiting for availability of Elasticsearch. This can take several minutes.
setup-1  |    ⠿ Elasticsearch is running
setup-1  | [+] Waiting for initialization of built-in users
setup-1  |    ⠿ Built-in users were initialized
setup-1  | [+] Role 'heartbeat_writer'
setup-1  |    ⠿ Creating/updating
setup-1  | [+] Role 'metricbeat_writer'
setup-1  |    ⠿ Creating/updating
setup-1  | [+] Role 'filebeat_writer'
setup-1  |    ⠿ Creating/updating
setup-1  | [+] Role 'logstash_writer'
setup-1  |    ⠿ Creating/updating
setup-1  | [+] User 'filebeat_internal'
setup-1  |    ⠿ No password defined, skipping
setup-1  | [+] User 'kibana_system'
setup-1  |    ⠿ User exists, setting password
setup-1  | [+] User 'logstash_internal'
setup-1  |    ⠿ User does not exist, creating
setup-1  | [+] User 'heartbeat_internal'
setup-1  |    ⠿ No password defined, skipping
setup-1  | [+] User 'metricbeat_internal'
setup-1  |    ⠿ No password defined, skipping
setup-1  | [+] User 'monitoring_internal'
setup-1  |    ⠿ No password defined, skipping
setup-1  | [+] User 'beats_system'
setup-1  |    ⠿ No password defined, skipping
setup-1 exited with code 0

```

### Como redefinir uma senha programaticamente

Se por algum motivo você não conseguir usar o Kibana para alterar a senha dos seus usuários (incluindo [usuários internos][usuários internos]), você pode usar a API do Elasticsearch e obter o mesmo resultado.

No exemplo abaixo, redefinimos a senha do usuário `elastic` (observe "/user/elastic" na URL):

```sh
curl -XPOST -D- 'http://localhost:9200/_security/user/elastic/_password' \
-H 'Content-Type: application/json' \
-u elastic:<sua senha elástica atual> \
-d '{"password" : "<sua nova senha>"}'
```

## Extensibilidade

### Como adicionar plugins

Para adicionar plugins a qualquer componente ELK, você precisa:

1. Adicionar uma instrução `RUN` ao `Dockerfile` correspondente (por exemplo, `RUN logstash-plugin install logstash-filter-json`)
1. Adicionar a configuração do código do plugin associado à configuração do serviço (por exemplo, entrada/saída do Logstash)
1. Reconstruir as imagens usando o comando `docker compose build`

### Como habilitar as extensões fornecidas

Algumas extensões estão disponíveis dentro do diretório [`extensions`](extensions).
Essas extensões fornecem recursos que não fazem parte da pilha Elastic padrão, mas podem ser usados para enriquecê-la com integrações extras.

A documentação para essas extensões é fornecida dentro dos subdiretórios de cada extensão.
Algumas delas exigem alterações manuais na configuração ELK padrão.


# 01 - Curator

O Elasticsearch Curator ajuda você a curar ou gerenciar seus índices.

## Uso

Se você quiser incluir a extensão Curator, execute o Docker Compose a partir da raiz do repositório (docker-elk) com um argumento de linha de comando adicional referenciando o arquivo `curator-compose.yml`:

```bash
$ docker compose -f docker-compose.yml -f extensions/curator/curator-compose.yml up
```

Esta configuração de exemplo demonstra como executar o `curator` a cada minuto usando `cron`.

Todos os arquivos de configuração estão disponíveis no diretório `config/`.

## Documentação

[Referência do Curator](https://www.elastic.co/guide/en/elasticsearch/client/curator/current/index.html)





# 02 - Extensão Enterprise Search

Elastic Enterprise Search é um conjunto de produtos para aplicativos de pesquisa apoiados pelo Elastic Stack.

## Requisitos

* 2 GB de RAM livre, além dos recursos exigidos pelos outros componentes e extensões do stack.

O aplicativo da web Enterprise Search é servido na porta TCP `3002`.

## Uso

### Gerar uma chave de criptografia

O Enterprise Search requer que uma ou mais [chaves de criptografia][enterprisesearch-encryption] sejam configuradas antes da inicialização. Deixar de fazer isso impede que o servidor seja iniciado.

As chaves de criptografia podem conter qualquer série de caracteres. A Elastic recomenda usar chaves de 256 bits para segurança ideal.

Essas chaves de criptografia devem ser adicionadas manualmente ao arquivo [`config/enterprise-search.yml`][config-enterprisesearch]. Por padrão, a lista de chaves de criptografia está vazia e deve ser preenchida usando um dos seguintes formatos:

```yaml
secret_management.encryption_keys:
- minha_primeira_chave_de_criptografia
- minha_segunda_chave_de_criptografia
- ...
```

```yaml
secret_management.encryption_keys: [minha_primeira_chave_de_criptografia, minha_segunda_chave_de_criptografia, ...]
```

> [!NOTA]
> Para gerar uma chave de criptografia aleatória forte, você pode usar o utilitário OpenSSL ou qualquer outra ferramenta online/offline de sua escolha:
>
> ```console
> $ openssl rand -hex 32
> 680f94e568c90364bedf927b2f0f49609702d3eab9098688585a375b14274546
> ```

### Habilitar o serviço de chave de API do Elasticsearch

O Enterprise Search requer que o [serviço de chave de API][es-security] integrado do Elasticsearch esteja habilitado para iniciar.
A menos que o Elasticsearch esteja configurado para habilitar TLS na interface HTTP (este serviço é desabilitado por padrão).

Para habilitá-lo, modifique o arquivo de configuração do Elasticsearch em [`elasticsearch/config/elasticsearch.yml`][config-es] e adicione a seguinte configuração:

```yaml
xpack.security.authc.api_key.enabled: true
```

### Configurar o host do Enterprise Search no Kibana

O Kibana atua como a [interface de gerenciamento][enterprisesearch-kb] para o Enterprise Search.

Para habilitar a experiência de gerenciamento para o Enterprise Search, modifique o arquivo de configuração do Kibana em [`kibana/config/kibana.yml`][config-kbn] e adicione a seguinte configuração:

```yaml
enterpriseSearch.host: http://enterprise-search:3002
```

### Inicie o servidor

Para incluir o Enterprise Search na pilha, execute o Docker Compose na raiz do repositório (docker-elk) com um argumento de linha de comando adicional referenciando o arquivo `enterprise-search-compose.yml`:

```console
$ docker compose -f docker-compose.yml -f extensions/enterprise-search/enterprise-search-compose.yml up
```

Aguarde alguns minutos para que a pilha seja iniciada e, em seguida, abra seu navegador da Web no endereço <http://localhost:3002> para ver a página inicial do Enterprise Search.

O Enterprise Search é configurado na primeira inicialização com as seguintes credenciais padrão:

* usuário: *enterprise_search*
* senha: *changeme*

## Segurança

A senha do Enterprise Search é definida dentro do arquivo Compose (enterprise-search-compose.yml) por meio da variável de ambiente `ENT_SEARCH_DEFAULT_PASSWORD`.
Recomendamos fortemente escolher uma senha mais segura do que a padrão por motivos de segurança.

Para fazer isso, altere o valor da variável de ambiente `ENT_SEARCH_DEFAULT_PASSWORD` dentro do arquivo Compose (enterprise-search-compose.yml) **antes da primeira inicialização**:

```yaml
enterprise-search:

ambiente:
ENT_SEARCH_DEFAULT_PASSWORD: {{some strong password}}
```

> [!AVISO]
> A senha padrão do Enterprise Search só pode ser definida durante a inicialização. Depois que a senha for persistida no Elasticsearch, ela só poderá ser alterada por meio da API do Elasticsearch.

Para obter mais informações, consulte [Gerenciamento de usuários e segurança][enterprisesearch-security].

## Configurando o Enterprise Search

A configuração do Enterprise Search é armazenada em [`config/enterprise-search.yml`][config-enterprisesearch]. Você pode modificar este arquivo usando a [Configuração padrão do Enterprise Search][enterprisesearch-config] como referência.

Você também pode especificar as opções que deseja substituir definindo variáveis ​​de ambiente dentro do arquivo Compose:

```yaml
enterprise-search:

environment:
ent_search.auth.source: standard
worker.threads: '6'
```

Qualquer alteração na configuração do Enterprise Search requer uma reinicialização do contêiner do Enterprise Search:

```console
$ docker compose -f docker-compose.yml -f extensions/enterprise-search/enterprise-search-compose.yml restart enterprise-search
```

Consulte a seguinte página de documentação para obter mais detalhes sobre como configurar o Enterprise Search dentro de um contêiner do Docker: [Executando o Enterprise Search usando o Docker][enterprisesearch-docker].

## Veja também

[Documentação do Enterprise Search][enterprisesearch-docs]

[config-enterprisesearch]: ./config/enterprise-search.yml

[enterprisesearch-encryption]: https://www.elastic.co/guide/en/enterprise-search/current/encryption-keys.html
[enterprisesearch-security]: https://www.elastic.co/guide/en/workplace-search/current/workplace-search-security.html
[enterprisesearch-config]: https://www.elastic.co/guide/en/enterprise-search/current/configuration.html
[enterprisesearch-docker]: https://www.elastic.co/guide/en/enterprise-search/current/docker.html
[enterprisesearch-docs]: https://www.elastic.co/guide/en/enterprise-search/current/index.html
[enterprisesearch-kb]: https://www.elastic.co/guide/en/kibana/current/enterprise-search-settings-kb.html

[es-security]: https://www.elastic.co/guide/en/elasticsearch/reference/current/security-settings.html#api-key-service-settings
[config-es]: ../../elasticsearch/config/elasticsearch.yml
[config-kbn]: ../../kibana/config/kibana.yml



# 03 - Filebeat

Filebeat é um despachante leve para encaminhar e centralizar dados de log.
Instalado como um agente nos servidores monitorados, o Filebeat monitora os arquivos de log ou locais que você especificar, coleta eventos de log e os encaminha para o Elasticsearch ou Logstash para indexação.

## Uso

**Esta extensão requer que os usuários `filebeat_internal` e `beats_system` sejam criados e inicializados com uma senha.
-- Esses usuários e senhas são criados quando o container setup é criado/executado (docker compose up setup)
** Caso você não tenha feito isso durante a inicialização da pilha, consulte [Como reexecutar a configuração][setup] para executar o contêiner de configuração novamente e inicializar esses usuários.

Para incluir o Filebeat na pilha, execute o Docker Compose a partir da raiz do repositório (docker-elk) com um argumento de linha de comando adicional referenciando o arquivo `filebeat-compose.yml`:

```console
$ docker compose -f docker-compose.yml -f extensions/filebeat/filebeat-compose.yml up
```

## Configurando o Filebeat

A configuração do Filebeat é armazenada em [`config/filebeat.yml`](./config/filebeat.yml).
Você pode modificar este arquivo com a ajuda da [Referência de configuração][filebeat-config].

Qualquer alteração na configuração do Filebeat requer uma reinicialização do contêiner Filebeat com o comando abaixo:

```console
$ docker compose -f docker-compose.yml -f extensions/filebeat/filebeat-compose.yml restart filebeat
```

Consulte a seguinte página de documentação para obter mais detalhes sobre como configurar o Filebeat dentro de um contêiner Docker: [Executar Filebeat no Docker][filebeat-docker].

## Veja também

[Documentação do Filebeat][filebeat-doc]

[filebeat-config]: https://www.elastic.co/guide/en/beats/filebeat/current/filebeat-reference-yml.html
[filebeat-docker]: https://www.elastic.co/guide/en/beats/filebeat/current/running-on-docker.html
[filebeat-doc]: https://www.elastic.co/guide/en/beats/filebeat/current/index.html

[setup]: ../../README.md#how-to-re-execute-the-setup



# 04 - Servidor Fleet

> [!AVISO]
> Esta extensão existe atualmente para fins de visualização e deve ser considerada **EXPERIMENTAL**.
Aguarde mudanças regulares nas configurações padrão do Fleet, tanto no Elastic Agent quanto no Kibana.
>
> Veja [Problemas conhecidos](#known-issues) para uma lista de problemas que precisam ser resolvidos antes que essa extensão possa ser considerada funcional.

O Fleet fornece recursos de gerenciamento central para [Agentes Elastic][fleet-doc] por meio de uma API e uma interface web do Kibana, com o Elasticsearch atuando como camada de comunicação.
O Servidor Fleet é o componente central que permite conectar os Agentes Elastic ao Fleet.

## Requisitos

O Fleet Server expõe a porta TCP `8220` para comunicações do Agente para o Servidor.

## Uso

Para incluir o Fleet Server na pilha, execute o Docker Compose na raiz do repositório (docker-elk) com um argumento de linha de comando referenciando adicionalmente o arquivo `fleet-compose.yml`:

```console
$ docker compose -f docker-compose.yml -f extensions/fleet/fleet-compose.yml up
```

Para incluir o Fleet Server e o APM Server na pilha, execute o Docker Compose na raiz do repositório (docker-elk) com um argumento de linha de comando referenciando adicionalmente os arquivos `fleet-compose.yml` e `agent-apmserver-compose.yml:

Exemplo de Agente Elastic registrado no Fleet e pré-configurado com uma política de agente para executar a integração do Servidor APM (consulte kibana.yml).

Executar com
docker compose \
 -f docker-compose.yml \
 -f extensions/fleet/fleet-compose.yml \
 -f extensions/fleet/agent-apmserver-compose.yml \
 up

## Configurando o Fleet Server

O Servidor Fleet — como qualquer Agente Elastic — é configurado via [Políticas de Agentes][fleet-pol] que podem ser gerenciadas através da UI de gerenciamento do Fleet no Kibana ou pré-configurado estaticamente dentro do arquivo de configuração do Kibana.

Para facilitar o registro do Servidor Fleet nesta extensão, o docker-elk vem com uma Política de Agente pré-configurada para o Servidor Fleet, definida em [`kibana/config/kibana.yml`][config-kbn].

Consulte a seguinte página de documentação para obter mais detalhes sobre a configuração do Servidor Fleet por meio da IU de gerenciamento do Fleet: [UI de Configurações do Fleet][fleet-cfg].

## Problemas conhecidos

- O Agente Elastic se registra automaticamente usando o superusuário `elastic`.
Com essa abordagem, você não precisa gerar um token de serviço — nem usando a UI de gerenciamento do Fleet nem o [utilitário CLI][es-svc-token] — antes de iniciar esta extensão.
Por mais conveniente que seja, essa abordagem _não segue as práticas recomendadas de segurança_, e recomendamos gerar um token de serviço para o Servidor Fleet.

## Veja também

[Guia do Servidor Fleet e dos Agentes Elastic][fleet-doc]

## Capturas de tela

![fleet-agents](https://user-images.githubusercontent.com/3299086/202701399-27518fe4-17b7-49d1-aefb-868dffeaa68a.png "Agentes do Fleet")
![elastic-agent-dashboard](https://user-images.githubusercontent.com/3299086/202701404-958f8d80-a7a0-4044-bbf9-bf73f3bdd17a.png "Painel dos Agentes Elastic")

[fleet-doc]: https://www.elastic.co/guide/en/fleet/current/fleet-overview.html
[fleet-pol]: https://www.elastic.co/guide/en/fleet/current/agent-policy.html
[fleet-cfg]: https://www.elastic.co/guide/en/fleet/current/fleet-settings.html

[config-kbn]: ../../kibana/config/kibana.yml

[es-svc-token]: https://www.elastic.co/guide/en/elasticsearch/reference/current/service-tokens-command.html




# 05 - Heartbeat

Heartbeat é um monitor leve que verifica periodicamente o status dos serviços Elastic e determina se eles estão disponíveis.

## Uso

**Esta extensão requer que os usuários `heartbeat_internal` e `beats_system` sejam criados e inicializados com uma senha.** Caso você não tenha feito isso durante a inicialização da pilha, consulte [Como reexecutar a configuração][setup] para executar a configuração do contêiner novamente e inicializar esses usuários.

Para incluir o Heartbeat na pilha, execute o Docker Compose a partir da raiz do repositório (docker-elk) com um argumento de linha de comando adicional referenciando o arquivo `heartbeat-compose.yml`:

```console
$ docker compose -f docker-compose.yml -f extensions/heartbeat/heartbeat-compose.yml up
```

## Configurando o Heartbeat

A configuração do Heartbeat é armazenada em [`config/heartbeat.yml`](./config/heartbeat.yml). Você pode modificar este arquivo com a ajuda da [Referência de configuração][heartbeat-config].

Qualquer alteração na configuração do Heartbeat requer uma reinicialização do contêiner Heartbeat:

```console
$ docker compose -f docker-compose.yml -f extensions/heartbeat/heartbeat-compose.yml restart heartbeat
```

Consulte a seguinte página de documentação para obter mais detalhes sobre como configurar o Heartbeat dentro de um contêiner Docker: [Executar Heartbeat no Docker][heartbeat-docker].

## Veja também

[Documentação do Heartbeat][heartbeat-doc]

[heartbeat-config]: https://www.elastic.co/guide/en/beats/heartbeat/current/heartbeat-reference-yml.html
[heartbeat-docker]: https://www.elastic.co/guide/en/beats/heartbeat/current/running-on-docker.html
[heartbeat-doc]: https://www.elastic.co/guide/en/beats/heartbeat/current/index.html

[setup]: ../../README.md#how-to-re-execute-the-setup



# 06 - Metricbeat

O Metricbeat é um coletor leve que você pode instalar em seus servidores para coletar periodicamente, métricas do sistema operacional e de serviços em execução no servidor.
O Metricbeat pega as métricas e estatísticas que ele coleta e as envia para onde você especificar, Elasticsearch ou Logstash.

## Uso

**Esta extensão requer que os usuários `metricbeat_internal`, `monitoring_internal` e `beats_system` sejam criados e inicializados com uma senha.
-- Esses usuários e senhas são criados quando o container setup é criado/executado (docker compose up setup)
** Caso você não tenha feito isso durante a inicialização da pilha, consulte [Como reexecutar a configuração][setup] para executar o contêiner de configuração novamente e inicializar esses usuários.

Para incluir o Metricbeat na pilha, execute o Docker Compose a partir da raiz do repositório (docker-elk) com um argumento de linha de comando adicional referenciando o arquivo `metricbeat-compose.yml`:

```console
$ docker compose -f docker-compose.yml -f extensions/metricbeat/metricbeat-compose.yml up
```

## Configurando o Metricbeat

A configuração do Metricbeat é armazenada em [`config/metricbeat.yml`](./config/metricbeat.yml).
Você pode modificar este arquivo com a ajuda da [Referência de configuração][metricbeat-config].

Qualquer alteração na configuração do Metricbeat requer uma reinicialização do contêiner Metricbeat com o seguinte comando:

```console
$ docker compose -f docker-compose.yml -f extensions/metricbeat/metricbeat-compose.yml restart metricbeat
```

Consulte a seguinte página de documentação para obter mais detalhes sobre como configurar o Metricbeat dentro de um contêiner Docker: [Executar Metricbeat no Docker][metricbeat-docker].

## Veja também

[Documentação do Metricbeat][metricbeat-doc]

## Capturas de tela

![stack-monitoring](https://user-images.githubusercontent.com/3299086/202710574-32a3d419-86ea-4334-b6f7-62d7826df18d.png "Monitoramento de pilha")
![host-dashboard](https://user-images.githubusercontent.com/3299086/202710594-0deccf40-3a9a-4e63-8411-2e0d9cc6ad3a.png "Painel de visão geral do host")

[metricbeat-config]: https://www.elastic.co/guide/en/beats/metricbeat/current/metricbeat-reference-yml.html
[metricbeat-docker]: https://www.elastic.co/guide/en/beats/metricbeat/current/running-on-docker.html
[metricbeat-doc]: https://www.elastic.co/guide/en/beats/metricbeat/current/index.html

[setup]: ../../README.md#como-re-executar-a-configuração




## Ajuste de JVM

### Como especificar a quantidade de memória usada por um serviço

Os scripts de inicialização para Elasticsearch e Logstash podem anexar opções JVM extras do valor de uma variável de ambiente, permitindo que o usuário ajuste a quantidade de memória que pode ser usada por cada componente:

| Serviço | Variável de ambiente |
|---------------|----------------------|
| Elasticsearch | ES_JAVA_OPTS |
| Logstash | LS_JAVA_OPTS |

Para acomodar ambientes onde a memória é escassa (o Docker Desktop para Mac tem apenas 2 GB disponíveis por padrão), a alocação do Tamanho do Heap é limitada por padrão no arquivo `docker-compose.yml` para 512 MB para Elasticsearch e 256 MB para Logstash. Se você quiser substituir a configuração padrão da JVM, edite as variáveis ​​de ambiente correspondentes no arquivo `docker-compose.yml`.

Por exemplo, para aumentar o Tamanho máximo do Heap da JVM para Logstash:

```yml
logstash:

ambiente:
LS_JAVA_OPTS: -Xms1g -Xmx1g
```

Quando essas opções não são definidas:

* O Elasticsearch inicia com um Tamanho do Heap da JVM que é [determinado automaticamente][es-heap].
* O Logstash inicia com um Tamanho do Heap da JVM fixo de 1 GB.

### Como habilitar uma conexão JMX remota para um serviço

Quanto à memória Java Heap (veja acima), você pode especificar opções JVM para habilitar JMX e mapear a porta JMX no host Docker.

Atualize a variável de ambiente `{ES,LS}_JAVA_OPTS` com o seguinte conteúdo (eu mapeei o serviço JMX na porta 18080, você pode alterar isso). Não se esqueça de atualizar a opção `-Djava.rmi.server.hostname` com o endereço IP do seu host Docker (substitua **DOCKER_HOST_IP**):

```yml
logstash:

environment:
LS_JAVA_OPTS: -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.port=18080 -Dcom.sun.management.jmxremote.rmi.port=18080 -Djava.rmi.server.hostname=DOCKER_HOST_IP -Dcom.sun.management.jmxremote.local.only=false
```

## Indo além

### Plugins e integrações

Veja as seguintes páginas Wiki:

* [Aplicativos externos](https://github.com/deviantony/docker-elk/wiki/External-applications)
* [Integrações populares](https://github.com/deviantony/docker-elk/wiki/Popular-integrations)

[elk-stack]: https://www.elastic.co/what-is/elk-stack
[elastic-docker]: https://www.docker.elastic.co/
[subscriptions]: https://www.elastic.co/subscriptions
[es-security]: https://www.elastic.co/guide/en/elasticsearch/reference/current/security-settings.html
[license-settings]: https://www.elastic.co/guide/en/elasticsearch/reference/current/license-settings.html
[license-mngmt]: https://www.elastic.co/guide/en/kibana/current/managing-licenses.html
[license-apis]: https://www.elastic.co/guide/en/elasticsearch/reference/current/licensing-apis.html

[elastdocker]: https://github.com/sherifabdlnaby/elastdocker

[docker-install]: https://docs.docker.com/get-docker/
[compose-install]: https://docs.docker.com/compose/install/
[linux-postinstall]: https://docs.docker.com/engine/install/linux-postinstall/

[bootstrap-checks]: https://www.elastic.co/guide/en/elasticsearch/reference/current/bootstrap-checks.html
[es-sys-config]: https://www.elastic.co/guide/en/elasticsearch/reference/current/system-config.html
[es-heap]: https://www.elastic.co/guide/en/elasticsearch/reference/current/important-settings.html#heap-size-settings

[win-filesharing]: https://docs.docker.com/desktop/settings/windows/#file-sharing
[mac-filesharing]: https://docs.docker.com/desktop/settings/mac/#file-sharing

[builtin-users]: https://www.elastic.co/guide/en/elasticsearch/reference/current/built-in-users.html
[ls-monitoring]: https://www.elastic.co/guide/en/logstash/current/monitoring-with-metricbeat.html
[sec-cluster]: https://www.elastic.co/guide/en/elasticsearch/reference/current/secure-cluster.html

[connect-kibana]: https://www.elastic.co/guide/en/kibana/current/connect-to-elasticsearch.html
[index-pattern]: https://www.elastic.co/guide/en/kibana/current/index-patterns.html

[config-es]: ./elasticsearch/config/elasticsearch.yml
[config-kbn]: ./kibana/config/kibana.yml
[config-ls]: ./logstash/config/logstash.yml

[es-docker]: https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html
[kbn-docker]: https://www.elastic.co/guide/en/kibana/current/docker.html
[ls-docker]: https://www.elastic.co/guide/en/logstash/current/docker-config.html

[upgrade]: https://www.elastic.co/guide/en/elasticsearch/reference/current/setup-upgrade.html
