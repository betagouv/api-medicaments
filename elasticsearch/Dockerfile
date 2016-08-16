FROM elasticsearch:2.3.4

RUN /usr/share/elasticsearch/bin/plugin install mobz/elasticsearch-head && \
    /usr/share/elasticsearch/bin/plugin install royrusso/elasticsearch-HQ

COPY java.policy /tmp/java.policy

RUN cat /tmp/java.policy >> /usr/lib/jvm/java-8-openjdk-amd64/jre/lib/security/java.policy

RUN  /usr/share/elasticsearch/bin/plugin install https://github.com/couchbaselabs/elasticsearch-transport-couchbase/releases/download/2.2.3.4/elasticsearch-transport-couchbase-2.2.3.4.zip

ADD elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml



EXPOSE 9091
