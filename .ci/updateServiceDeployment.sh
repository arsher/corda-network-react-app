# Login to Azure for our subscription
az login --service-principal --username $K8_DEPLOY_USER --password $K8_DEPLOY_PASSWORD --tenant $K8_DEPLOY_TENANT
if [ $? -ne 0 ]
then
  echo "Failed to log in to Azure." >&2
  exit 1
fi

# Get credentials to access the cluster we're deploying to
az aks get-credentials --resource-group=$K8_DEPLOY_RESGROUP --name=$K8_DEPLOY_CLUSTER --subscription $K8_DEPLOY_SUB --overwrite-existing
if [ $? -ne 0 ]
then
  echo "Failed to get credentials for cluster." >&2
  exit 1
fi

kubectl config use-context $K8_DEPLOY_CLUSTER
if [ $? -ne 0 ]
then
  echo "Failed to use cluster with kubectl." >&2
  exit 1
fi

# Deploy
defaultManifest="./kubernetes-deploy-staging.yaml"
manifest=${1:-$defaultManifest} 

chmod +x ./replaceVars.sh
./replaceVars.sh $manifest | kubectl apply -f -

# Log out of Azure (our subscription only) as well as kubectl
az logout --subscription $K8_DEPLOY_SUB
kubectl config delete-context $K8_DEPLOY_CLUSTER