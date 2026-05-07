pipeline {
    agent any

    tools {
        maven 'maven3'
    }

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {
        stage('Backend Test') {
            steps {
                dir('backend') {
                    sh 'mvn -B -ntp test'
                }
            }
            post {
                always {
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }
    }
}
