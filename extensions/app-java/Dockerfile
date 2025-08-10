# Usar uma imagem base do OpenJDK
FROM eclipse-temurin

# Diretório de trabalho
WORKDIR /app

# Copiar o APM Agent
# ADD https://repo1.maven.org/maven2/co/elastic/apm/elastic-apm-agent/1.52.1/elastic-apm-agent-1.52.1.jar /app/elastic-apm-agent.jar
COPY elastic-apm-agent-1.52.1.jar /app/elastic-apm-agent-1.52.1.jar

# Copiar o arquivo de configuração do agente elastic apm, deve estar na mesma pasta do agente java.
COPY elasticapm.properties /app/elasticapm.properties
#COPY elasticapm.yml /app/elasticapm.yml (O agente não faz parse desse arquivo no formato yml, lê o arquivo como se fosse .properties)

# Copiar o código
COPY docker-elk-java.jar /app/docker-elk-java.jar

# Porta exposta
EXPOSE 8880

# Comando para executar a aplicação com o agente APM
CMD ["java", "-javaagent:/app/elastic-apm-agent-1.52.1.jar", "-jar","/app/docker-elk-java.jar"]

