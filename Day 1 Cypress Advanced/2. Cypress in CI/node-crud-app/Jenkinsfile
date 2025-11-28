pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci || npm install'
            }
        }

        stage('Start App') {
            steps {
                // Start dev server for tests (nodemon)
                sh 'npm run dev &'
                sh 'npx wait-on http://localhost:3000'
            }
        }

        stage('Run Cypress E2E Tests') {
            steps {
                sh 'npm run test:e2e'
            }
        }

        // 🔽 NEW STAGE HERE
        stage('Deploy (Local)') {
            when {
                branch 'main'   // only deploy from main; adjust if needed
            }
            steps {
                echo 'Deploying CRUD app (local)...'

                // For demo purposes we just start a "prod" server.
                // In real-world you'd NOT usually run prod inside Jenkins container,
                // but on some separate server or container.

                // Kill any existing node index.js if running
                sh '''
                  pkill -f "node index.js" || true
                '''

                // Start prod server in background
                sh '''
                  nohup npm start >/var/log/crud-app.log 2>&1 &
                '''

                echo 'Deployment (local) finished.'
            }
        }
    }

    post {
        success {
            echo '✅ All stages passed. Cypress tests are green and app is deployed.'
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
    }
}
