pipeline {
    agent any

    tools {
        maven 'maven3'
        nodejs 'node22'
    }

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {
        stage('Build') {
            parallel {
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

                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            sh 'node --version'
                            sh 'npm --version'
                            sh 'npm ci'
                            sh 'npm run lint || echo "Lint reported issues (non-blocking)"'
                            sh 'npm run build'
                        }
                    }
                }
            }
        }
    }
}
