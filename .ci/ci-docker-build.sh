#!/bin/sh
set -eu

buildCounter=$1
commitHash=$2
triggeredBy=$3

srcFolder='Site Only'
LGREEN='\033[1;32m'
NC='\033[0m' # No Color

echo "${LGREEN}This is building from the $srcFolder source code\n${NC}"

echo "Deploy of $buildCounter at revision $commitHash by $triggeredBy" at $(date)

# az logout --subscription $K8_DEPLOY_SUB
# Login to Azure for our subscription
az login --service-principal --username $DOCKER_REGISTRY_USERNAME --password $DOCKER_REGISTRY_PASSWORD --tenant $K8_DEPLOY_TENANT

if [ $? -ne 0 ]
then
  echo "Failed to log in to Azure." >&2
  exit 1
fi

az acr login -n $DOCKER_REGISTRY_NAME

if [ $? -ne 0 ]
then
  echo "Failed to log in to Azure Container Registry." >&2
  exit 1
fi

docker build -t "$DOCKER_REGISTRY_NAME.azurecr.io/$DOCKER_IMAGE_NAME:$DOCKER_REGISTRY_TARGETTAG" "./$srcFolder/."
docker push "$DOCKER_REGISTRY_NAME.azurecr.io/$DOCKER_IMAGE_NAME:$DOCKER_REGISTRY_TARGETTAG"

# Log out of Azure (our subscription only) as well as kubectl
az logout --subscription $K8_DEPLOY_SUB

exit 1