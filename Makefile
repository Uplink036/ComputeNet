.PHONY: build up down

build: ## Docker compose build
	docker compose build

up: ## Docker compose up (detach)
	docker compose up -d

down: ## Docker compose down
	docker compose down

.PHONY: kubernetes
kubernetes: ## Kubernetes up
	kubectl apply -f kubernetes/controller.yaml kubernetes/database.yaml kubernetes/worker.yaml 

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'