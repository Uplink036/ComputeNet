.PHONY: build up down

build: ## Docker compose build
	docker compose build

up: ## Docker compose up (detach)
	docker compose up -d

down: ## Docker compose down
	docker compose down

dockerhub: build
	docker tag computenet-controller uplink036/controller
	docker push uplink036/controller
	docker tag computenet-worker uplink036/worker
	docker push uplink036/worker

.PHONY: kubernetes
kubernetes-up: ## Kubernetes up
	kubectl apply -f kubernetes/controller.yaml -f kubernetes/database.yaml -f kubernetes/worker.yaml 

kubernetes-down: ## Kubernetes down
	kubectl delete --cascade='foreground' -f kubernetes/controller.yaml -f kubernetes/database.yaml -f kubernetes/worker.yaml 

kubectl-status:
	kubectl get all

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'