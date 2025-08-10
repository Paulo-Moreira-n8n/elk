# Usar uma imagem do OpenJDK Eclipse
FROM eclipse-temurin

# Diretório de trabalho
WORKDIR /app

# Copiar o APM Agent
ADD https://repo1.maven.org/maven2/co/elastic/apm/elastic-apm-agent/1.52.1/elastic-apm-agent-1.52.1.jar elastic-apm-agent.jar

# Copiar o código
COPY docker-elk-java-copilot-1.0-SNAPSHOT.jar app.jar

# Porta exposta
EXPOSE 8085

# Comando para executar a aplicação com o agente APM
CMD ["java", "-jar", "app.jar"]

