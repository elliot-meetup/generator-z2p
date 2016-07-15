CI_BUILD_NUMBER ?= $(USER)-snapshot
CLUSTER ?= <%= stageCluster %>
ZONE ?= <%= stageZone %>

default: list

list:
	@sh -c "$(MAKE) -p no_targets__ | \
		awk -F':' '/^[a-zA-Z0-9][^\$$#\/\\t=]*:([^=]|$$)/ {split(\$$1,A,/ /);\
		for(i in A)print A[i]}' | \
		grep -v '__\$$' | \
		grep -v 'make\[1\]' | \
		grep -v 'Makefile' | \
		sort"
# required for list
no_targets__:

package:
	docker build -t <%= imageName %>:$(CI_BUILD_NUMBER) .

# here publish is method chaining to make package
# this is make's version of short methods and one calling another
publish: package
	docker push <%= imageName %>:$(CI_BUILD_NUMBER)

get-credentials:
	@gcloud config set project ai-blt
	@gcloud container clusters get-credentials $(CLUSTER) --zone $(ZONE)

deploy-only:
	-@kubectl create -f infra/<% namespaceName %>-ns.yaml
	sed -e "s/{{BUILD_NUMBER}}/$(CI_BUILD_NUMBER)/g" infra/<%= projectName %>-dply.yaml \
		| kubectl apply -f -

deploy: get-credentials deploy-only

set-prod:
	$(eval CLUSTER=<%= prodCluster %>)
	$(eval ZONE=<%= prodZone %>)

deploy-stage: deploy

deploy-prod: set-prod deploy
