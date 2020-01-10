#!/bin/sh
set -eu

buildCounter=$1
commitHash=$2
triggeredBy=$3

echo "Deploy of $buildCounter at revision $commitHash by $triggeredBy" at $(date)

# Login to Azure for our subscription
az login --service-principal --username $K8_DEPLOY_USER --password $K8_DEPLOY_PASSWORD --tenant $K8_DEPLOY_TENANT
if [ $? -ne 0 ]
then
  echo "Failed to log in to Azure." >&2
  exit 1
fi

# Log out of Azure (our subscription only) as well as kubectl
az logout --subscription $K8_DEPLOY_SUB

exit 1