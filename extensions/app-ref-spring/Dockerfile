# Usar uma imagem base do OpenJDK
# FROM registry.ctn.prevnet/redhat/openjdk-11-rhel8:1.3
FROM eclipse-temurin

# Diretório de trabalho
WORKDIR /app

# Copiar o APM Agent
# COPY elastic-apm-agent-1.52.1.jar /app/elastic-apm-agent-1.52.1.jar

# Copiar o arquivo de configuração do agente elastic apm, deve estar na mesma pasta do agente java.
# COPY elasticapm.properties /app/elasticapm.properties

# Copiar o código
COPY aplicacao-referencia-backend-springboot.jar /app/aplicacao-referencia-backend-springboot.jar

# Porta exposta
EXPOSE 443
EXPOSE 8080

# Comando para executar a aplicação com o agente APM
ENV JAVA_TOOL_OPTIONS -Dfile.encoding=UTF-8]


CMD ["java", "-Dfile.encoding=UTF-8", "-jar","/app/aplicacao-referencia-backend-springboot.jar"]


# CMD ["java", "-javaagent:/app/elastic-apm-agent-1.52.1.jar", "-Dfile.encoding=UTF-8", "-jar","/app/aplicacao-referencia-backend-springboot.jar"]

