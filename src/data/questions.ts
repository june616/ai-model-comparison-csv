import { Question } from '@/types/evaluation'

// Version tracking for dynamic updates
export const QUESTIONS_VERSION = '1.0.0'
export const QUESTIONS_LAST_UPDATED = new Date().toISOString()

export const SAMPLE_QUESTIONS: Omit<Question, 'ratings' | 'knowledgeLevel'>[] = [
  {
    id: 'q1',
    query: "How would you mitigate the following issue?\nOur instances in the Prod ring were created, but they had a capacity allocation issue that was resolved yesterday. When I attempted a deployment in the Prod ring, I encountered the following error:\n \n\"ErrorString\":\"ReleaseDefinitonNotFound\",\n\"ErrorCode\":4007,\"ErrorMessage\":\"No Cosmic release definition found for the namespace: 'substrate-3scopilot-3scopilotodinml'.\nPlease make sure that the namespace metadata is published to Griffin data service\"\n \nCould you help us investigate if the root cause is \"Onboarded namespace is not yet deployed to the synced to backend yet.\"? If so, could you provide an estimate for when the service will be ready for deployment?",
    modelA: {
      id: 'a1',
      model: 'Model A',
      response: "The error \"ReleaseDefinitionNotFound | 4007\" typically indicates that the namespace metadata has not yet been fully published and synchronized with Griffin Data Service. Below is how to investigate the root cause and mitigate the issue.\n\n**Common Causes**\n\n -- Namespace metadata not fully published or synchronized to Griffin Data Service.\n -- Misconfiguration or delays in namespace provisioning or capacity allocation.\n -- Inventory issue where namespace or partition details are not updated correctly.\n\n---\n\n**Steps to Investigate**\n\n1.- **Verify Namespace Metadata**: Run the following command to check metadata and provisioning status:\n\n ```bash\n cc get partition substrate-3scopilot-3scopilotodinml --region <region_name> --output yaml\n\n ```\n\n This will display the namespace and its provisioning details.\n\n2.- **Check Griffin Data Service**: Use the logging or dashboard mentioned in the error message (<https://aka.ms/cosmicappdeploymenttsg>) to ensure the namespace exists and is synchronized.\n\n3.- **Review Past Incidents**: Look for patterns or similar issues in [ICM#676732500](https://portal.microsofticm.com/imp/v5/incidents/details/676732500), [ICM#588520639](https://portal.microsofticm.com/imp/v5/incidents/details/588520639), and [GitHub Issue#7520](https://github.com/substrate-platform/COSMIC/issues/7520). These indicate potential resolution paths, including retries or metadata corrections.\n\n4.- **Retry Deployment**: As seen in prior cases, reattempt the deployment after confirming provisioning and metadata synchronization.\n\n---\n\n**Mitigation Suggestions**\n\n1.- **Ensure Namespace Metadata Publishing**: Confirm that the namespace metadata has been published into Griffin Data Service. If not, request the COSMIC team to synchronize it.\n\n2.- **Retry Deployment**: Based on prior cases (e.g., ICM#676732500), a retry, after ensuring no errors in provisioning, often resolves this transient issue.\n\n3.- **Update Namespace Configuration**: If the namespace details seem incomplete or inconsistent, update the required metadata (e.g., Torus team, partition details) via a Pull Request (ref GitHub Issue#7520).\n\n4.- **Reach Out for Assistance**: If the issue persists, escalate to Microsoft COSMIC's App Deployment team or the Capacity and Topologies team for manual synchronization or investigation.\n\n---\n\nFor further troubleshooting or reporting issues, please visit [COSMIC Troubleshooting Guide](https://aka.ms/cosmic911).\n\n**References**\n\n -- [App-Deployment-General Troubleshooting](https://aka.ms/cosmicappdeploymenttsg)\n -- [Create OneBranch Release Pipeline](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/onboarding/prepare-and-test-deployment/Create-OneBranch-release-pipeline)\n\n**Similar GitHub Issues and ICMs**\n\n -- [ICM#676732500 - Failed deployment due to ReleaseDefinitionNotFound](https://portal.microsofticm.com/imp/v5/incidents/details/676732500)\n --- **Resolution**: Synchronize Griffin Data Service metadata; retry resolved issue.\n -- [Issue#7520 - Namespace metadata synchronization issue](https://github.com/substrate-platform/COSMIC/issues/7520)\n --- **Resolution**: Retrying and ensuring correct namespace team fixed issue.\n -- [ICM#588520639 - Deployment failing with similar error](https://portal.microsofticm.com/imp/v5/incidents/details/588520639) \n --- **Resolution**: Correct namespace mapping to Torus team; retry succeeded."
    },
    modelB: {
      id: 'b1', 
      model: 'Model B',
      response: "To address the issue you're encountering with the `ReleaseDefinitionNotFound` error (ErrorCode: 4007), we need to investigate the root cause and confirm whether the namespace has been fully onboarded and synchronized to the backend. Below is a structured approach to investigate and mitigate the issue:\n\n---\n\n**Common Causes**\n1.- **Incomplete Namespace Provisioning**: The namespace may not have been fully provisioned or onboarded in the COSMIC environment.\n2.- **Backend Synchronization Delay**: The namespace metadata might not yet be synced to the GriffinD2 data service, which is required for deployment readiness.\n3.- **Deployment Timing**: Deployment may have been attempted before the namespace was fully operational in the backend.\n4.- **Configuration Issues**: Missing or incorrect namespace metadata, such as the `namespaceresources-metadata.json` file, could prevent the namespace from being recognized.\n\n---\n\n**Steps to Investigate**\n1.- **Verify Namespace Status**:\n -- Use the `cc` command to check if the namespace exists and is active:\n ```bash\n cc get namespaces <namespace-name>\n ```\n -- Alternatively, you can use the COSMIC Operation Portal (COP) to list namespaces and confirm the status of `substrate-3scopilot-3scopilotodinml`.\n\n2.- **Check Backend Synchronization**:\n -- Query the GriffinD2 data service to confirm whether the namespace metadata has been published:\n ```bash\n curl -X GET https://<cosmic-backend-endpoint>/api/v1/namespaces/<namespace-name>\n ```\n -- Look for a response indicating that the namespace is fully provisioned and operational.\n\n3.- **Review Namespace Metadata**:\n -- Ensure that the `namespaceresources-metadata.json` file is present and correctly configured for the PROD ring. This file should include the necessary ring overrides for each region [Data: Entities (9407); Relationships (16739)].\n\n4.- **Check Deployment Pipeline Logs**:\n -- Review the deployment logs in the Ev2 Portal or the COSMIC Deployment Dashboard to identify any additional error messages or warnings related to the namespace.\n\n5.- **Retry Deployment**:\n -- If the namespace is now provisioned and synced, retry the deployment:\n ```bash\n cc apply -f <deployment-file.yaml>\n ```\n\n---\n\n**Mitigation Suggestions**\n1.- **Wait for Backend Synchronization**:\n -- If the namespace is not yet synced to the backend, allow some time for the synchronization process to complete. This typically takes 20-30 minutes after the namespace is onboarded and metadata is published.\n\n2.- **Force Metadata Publication**:\n -- If the namespace metadata is missing or incomplete, update the GriffinD2 repository with the correct configuration. Submit a pull request (PR) for the namespace metadata and ensure it is approved and processed:\n --- Example PR: https://o365exchange.visualstudio.com/O365%20Core/_git/GriffinD2/pullrequest/2587141\n -- After the PR is approved, track the release in the GriffinD2 pipeline and ensure the \"Deploy: Copy inventory files to Prod blob storage\" stage is completed [Data: Entities (8016); Sources (3398)].\n\n3.- **Escalate to GriffinD2 Team**:\n -- If the issue persists despite verifying the namespace and metadata, escalate to the GriffinD2 team for further investigation. Provide the following details:\n --- Namespace name: `substrate-3scopilot-3scopilotodinml`\n --- Deployment logs\n --- Backend API response\n --- Error code: `ReleaseDefinitionNotFound-4007`\n\n4.- **Monitor Deployment Readiness**:\n -- Use the COSMIC monitoring tools or the PlatformAgent Dashboard to track the deployment readiness of the namespace. Ensure all dependencies and configurations are in place before retrying the deployment [Data: Reports (20)].\n\n---\n\n**Estimate for Service Readiness**\nIf the root cause is indeed a delay in backend synchronization, the namespace should be ready for deployment within 20-30 minutes after the metadata is published and processed. However, if additional configuration or manual intervention is required, the timeline may extend depending on the complexity of the issue and the approval process for metadata updates.\n\n---\n\n**References**\n-- [JIT Elevation](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/securely-access-app-jit)\n-- [COSMIC CLI (cc)](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/access-clusters-with-cc)\n-- [COSMIC Operation Portal (COP)](https://aka.ms/cop)\n\nBy following these steps, you should be able to confirm the root cause and resolve the issue, enabling successful deployment in the PROD ring. Let me know if you need further assistance!\n\n**Date:** 2025-09-16"
    }
  },
  {
    id: 'q2',
    query: "What could cause and how can we fix the ICM described at\nhttps://portal.microsofticm.com/imp/v5/incidents/details/666146192\nProvide the cc commands to investigate and fix the situation.",
    modelA: {
      id: 'a2',
      model: 'Model A',
      response: "The issue described in [ICM 666146192](https://portal.microsofticm.com/imp/v5/incidents/details/666146192) appears to involve a **Cosmic App Deployment pipeline issue** where deployments are not reaching the clusters. Key details for this incident reveal that no errors occur in the deployment validation stages, but key deployment steps are skipped, preventing the updates from being propagated.\n\n---\n\n**Common Causes**\n\n1.- **Skipped Deployment Steps**:\n\n -- Critical deployment steps like `SubmitCosmicDeployment` or `ValidatePartitions` might be marked as skipped in the EV2 pipeline.\n2.- **Unhealthy Pipeline**:\n\n -- Nightwatch detection of unhealthy deployment pipelines across clusters or rings could block rollouts.\n3.- **Misconfiguration of Deployment Artifacts**:\n\n -- Artifacts (like container images) not being properly propagated to expected clusters or partitions.\n4.- **Authentication/Authorization Failures**:\n\n -- Issues with permissions in EV2 or partition credentials may prevent the continuation of deployment.\n\n---\n\n**Steps to Investigate**\n\n1.- **Check Deployment Logs in the EV2 Portal**:\n\n -- Review the logs for the skipping behavior of key steps such as `SubmitCosmicDeployment`.\n -- Access the logs via the EV2 Deployment Dashboard ([link](https://aka.ms/cosmicdeploymentdashboard)).\n2.- **Review the Deployment Pipeline in COSMIC**:\n\n ```\n cc get namespaces\n cc get deployments -n <namespace>\n ```\n\n3.- **Ensure Proper Partition Configuration**:\n\n -- Verify the partition:\n ```\n cc get partitions\n cc describe partitions <partition-name>\n ```\n\n4.- **Network Connectivity Check**:\n\n -- Simulate connections from pods to confirm that they can pull images or reach dependent services:\n ```\n cc exec <pod-name> -- curl <service-endpoint>\n ```\n\n---\n\n**Mitigation Suggestions**\n\n1.- **Retrigger Deployment**:\n\n -- As advised in the ICM, manually retrigger the deployment in EV2.\n2.- **Fix Deployment Pipeline Skips**:\n\n -- Address skipped steps in the pipeline via EV2 setup corrections and ensure all validations (like `ValidatePartitions` and `SubmitCosmicDeployment`) are run.\n3.- **Check Cluster/Partition Health**:\n\n -- Ensure the partitions/clusters showing issues are healthy before attempting redeployment.\n4.- **Contact COSMIC Support**:\n\n -- If deployment remains stuck or skips persist, work with COSMIC support via [COSMIC911](https://aka.ms/cosmic911).\n\n---\n\n**Commands to Investigate and Fix**\n\n1.- **List Current Namespaces**:\n\n ```\n cc get namespaces\n\n ```\n\n2.- **Investigate Deployment Rollout Status**:\n\n ```\n cc rollout status deployment <deployment-name> -n <namespace>\n ```\n\n3.- **Check Deployment Pipeline Logs**:\n\n -- Get details for all deployments:\n ```\n cc get deployments -n <namespace>\n cc describe deployment <deployment-name> -n <namespace>\n ```\n\n4.- **Validate Partition and Resources Health**:\n\n ```\n cc get partitions\n cc describe partitions <partition-name>\n cc get pods -n <namespace>\n cc logs <pod-name> -n <namespace>\n ```\n\n5.- **Trigger Redeployment**:\n\n -- Use the EV2 portal to manually retrigger the pipeline [here](https://aka.ms/cosmicdeploymentdashboard).\n\n---\n\n**References**\n\n-- [ICM 666146192](https://portal.microsofticm.com/imp/v5/incidents/details/666146192)\n-- [COSMIC CLI Documentation](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/access-clusters-with-cc)\n-- [COSMIC Deployment Troubleshooting Tips](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/troubleshooting/application-deployment/App-Deployment-General-Troubleshooting)"
    },
    modelB: {
      id: 'b2',
      model: 'Model B',
      response: "I cannot directly access the ICM portal or view the specific details of the incident at the provided link. However, I can guide you on general troubleshooting steps for COSMIC-related incidents and provide relevant `cc` commands to investigate and resolve common issues. If you can share more details about the incident (e.g., symptoms, affected components, or error messages), I can tailor the response further.\n\n---\n\n**General Causes of COSMIC Incidents**\nBased on the COSMIC platform's architecture, common causes of incidents include:\n1.- **Nodepool Issues**: Problems with node capacity, scaling, or configuration can lead to pod scheduling failures or degraded performance.\n2.- **Load Balancer Misconfigurations**: Issues like SNAT port exhaustion, health probe failures, or incorrect IP settings can disrupt traffic distribution.\n3.- **Cluster-Level Problems**: API server unresponsiveness, pod scheduling conflicts, or resource exhaustion can impact overall cluster health.\n4.- **Pod-Level Failures**: Pods may fail due to image pull errors, misconfigured environment variables, or insufficient resources.\n5.- **Network Issues**: Misconfigured Network Security Groups (NSGs), DNS resolution failures, or CNI plugin errors can cause connectivity problems.\n\n---\n\n**Steps to Investigate**\nHere are the steps to investigate the issue, along with the corresponding `cc` commands:\n\n1.- **Check Pod Status**:\n -- Use the following command to list all pods and their statuses:\n ```bash\n cc get pods -A\n ```\n -- Look for pods in `Pending`, `CrashLoopBackOff`, or `Error` states.\n\n2.- **Describe Affected Pods**:\n -- If specific pods are failing, describe them to gather more details:\n ```bash\n cc describe pod <pod-name> -n <namespace>\n ```\n\n3.- **Inspect Node Health**:\n -- Check the status of nodes in the cluster:\n ```bash\n cc get nodes\n ```\n -- Look for nodes in `NotReady` or `Unknown` states.\n\n4.- **View Logs**:\n -- Retrieve logs from affected pods to identify errors:\n ```bash\n cc logs <pod-name> -n <namespace>\n ```\n\n5.- **Check Load Balancer Configuration**:\n -- If the issue involves traffic distribution, inspect the service and load balancer configurations:\n ```bash\n cc describe service <service-name> -n <namespace>\n ```\n\n6.- **Monitor Resource Usage**:\n -- Check resource usage at the node and pod levels:\n ```bash\n cc top nodes\n cc top pods -n <namespace>\n ```\n\n7.- **Network Troubleshooting**:\n -- Use the `cc netcapture` command to capture network traffic and identify connectivity issues:\n ```bash\n cc netcapture pod <pod-name> -n <namespace>\n ```\n\n8.- **Cluster-Wide Diagnostics**:\n -- Run the COSMIC troubleshooting tool for a high-level diagnostic:\n ```bash\n cc troubleshoot\n ```\n\n---\n\n**Mitigation Suggestions**\nOnce the root cause is identified, apply the following fixes based on the issue:\n\n1.- **Nodepool Issues**:\n -- Scale the nodepool if capacity is insufficient:\n ```bash\n cc scale deployment <deployment-name> --replicas=<number>\n ```\n -- Drain and cordon problematic nodes for maintenance:\n ```bash\n cc drain <node-name>\n cc cordon <node-name>\n ```\n\n2.- **Load Balancer Misconfigurations**:\n -- Update the service manifest to correct IP settings or health probes.\n -- Restart the affected service to reinitialize the load balancer:\n ```bash\n cc rollout restart deployment <deployment-name> -n <namespace>\n ```\n\n3.- **Cluster-Level Problems**:\n -- Restart the API server or other critical components if unresponsive (requires COSMIC team intervention).\n -- Verify cluster configurations using:\n ```bash\n cc get configmaps -A\n ```\n\n4.- **Pod-Level Failures**:\n -- Redeploy the affected pods or deployments:\n ```bash\n cc rollout restart deployment <deployment-name> -n <namespace>\n ```\n\n5.- **Network Issues**:\n -- Verify NSG rules and DNS configurations.\n -- Use `cc netcapture` to identify and resolve connectivity issues.\n\n---\n\n**Escalation and Additional Support**\nIf the issue persists after applying the above steps, escalate the incident through the ICM portal or contact the COSMIC support team. You can also use the COSMIC Operations Portal (COP) to create or manage ICMs and access additional troubleshooting tools.\n\nFor more information on `cc` commands and JIT elevation, refer to the following resources:\n-- [JIT Elevation](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/securely-access-app-jit)\n-- [COSMIC CLI (cc)](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/access-clusters-with-cc)\n-- [COSMIC Operation Portal (COP)](https://aka.ms/cop)\n\nIf you can provide more details about the incident, I can refine these steps further.\n\n**Date:** 2025-09-16"
    }
  },
  {
    id: 'q3',
    query: "How would you mitigate the following issue? \n \n-- Title: Error while deploying to new DEV ring \n-- Current Behavior: Getting the error when triggering a deployment on Cosmic: \nThe activity function \'CosmicTorusTeamValidationTrigger\' failed: \"DataServiceClient API failed to get Microsoft.Office.Substrate.D2Services.CosmicAppDeployment.DataServiceClient.CosmicReleaseDefinition with error response: \". See the function execution logs for additional details. \n-- Link: https://ev2portal.azure.net/#/Rollout/CosmicNpeResources/66b2e54c-d5ce-4231-916b-6571f795d9bd?RolloutInfra=Test \n-- Expected Behavior: The release is submitted to Cosmic. \n-- Ring: dev \n-- Region Name: eastus-2 \n-- Namespace Name: ic3-auth-runtimeapi \n-- Service: Runtime API \n-- Container Type: Windows \n-- Container Image: Cosmic Base Image",
    modelA: {
      id: 'a3',
      model: 'Model A',
      response: "The issue with \"CosmicTorusTeamValidationTrigger\" failing indicates a problem with the namespace validation or missing/inaccurate metadata in Griffin Data Service. Below are steps to mitigate and resolve the issue. \n \n--- \n \n**Common Causes** \n \n1.- **Namespace Metadata Not Published or Updated**: The namespace metadata may not be synchronized with Griffin Data Service. \n2.- **Incorrect Torus Team Metadata**: The `TorusTeam` specified in the deployment pipeline does not match the one configured during onboarding. \n3.- **Invalid Configuration**: Multiple teams associated with the namespace or missing required details in Griffin Data Services. \n \n--- \n \n**Steps to Investigate** \n \n1.- **Verify Metadata in Griffin Service**: \n \n -- Use the tools or telemetry logs linked from the error message to verify that the namespace `ic3-auth-runtimeapi` exists and is properly configured. \n2.- **Check Namespace and Torus Configuration**: \n \n -- Run: \n ``` \n cc describe namespace ic3-auth-runtimeapi --output yaml \n \n ``` \n \n -- Ensure the correct `TorusTeam` is specified. Compare the value in the `cc` output with what is provided in the EV2 deployment configuration. \n3.- **Deployment Logs**: \n \n -- Review EV2 logs for additional error details by visiting the [EV2 Portal Dashboard](https://ev2portal.azure.net/#/Rollout/CosmicNpeResources/66b2e54c-d5ce-4231-916b-6571f795d9bd?RolloutInfra=Test). \n4.- **Team Validation Check**: \n \n -- Ensure that only one Torus team is associated with the namespace to avoid conflicts. \n \n--- \n \n**Mitigation Suggestions** \n \n1.- **Correct Torus Team Configuration**: \n \n -- Update the namespace configuration with the correct Torus team: \n ``` \n cc edit namespace ic3-auth-runtimeapi \n \n ``` \n Ensure the metadata matches onboarding portal configurations. \n2.- **Manually Synchronize Metadata**: \n \n -- Request the COSMIC onboarding team to synchronize the namespace metadata with Griffin Data Services. \n3.- **Retry Deployment**: \n \n -- After metadata updates, retry the deployment from the pipeline. This often resolves transient issues after synchronization. \n4.- **Escalate if Needed**: \n \n -- If the issue persists, escalate to the COSMIC App Deployment team via [COSMIC Troubleshooting Guide](https://aka.ms/cosmic911) for manual metadata correction. \n \n--- \n \n**References** \n \n-- [Fast Deployment to COSMIC DEV Ring in Visual Studio](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/onboarding/prepare-and-test-deployment/DevXpress-fast-deployment-to-cosmic-dev-ring-in-visual-studio) \n-- [Prepare and Test Deployment](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/onboarding/prepare-and-test-deployment/Scaffold-win-RDFE-to-COSMIC) \n-- [Onboard Service Metadata](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/onboarding/prepare-and-test-deployment/onboard-service-metadata) \n \n--- \n \n**Similar GitHub Issues and ICMs** \n \n-- [Issue# 7128 - Error while deploying to new DEV ring](https://github.com/substrate-platform/COSMIC/issues/7128) \n --- **Description**: Deployment failed due to Torus Team mismatch. \n --- **Resolution**: Metadata corrected, and the correct Torus Team was configured. \n --- **Status**: Closed. \n-- [ICM 569864022 - CosmicTorusTeamValidationTrigger blocking deployments](https://portal.microsofticm.com/imp/v5/incidents/details/569864022) \n --- **Resolution**: Metadata validated and redeployment succeeded. \n --- **Status**: Resolved."
    },
    modelB: {
      id: 'b3',
      model: 'Model B',
      response: "To mitigate the issue described, where the deployment to the new DEV ring fails with the error related to the `CosmicTorusTeamValidationTrigger` activity function, follow the structured approach below:\n\n---\n\n**Common Causes**\n1.- **DataServiceClient API Failure**: The error indicates that the `DataServiceClient` API failed to retrieve the `CosmicReleaseDefinition`. This could be due to:\n   -- Misconfigured or missing release definitions in the deployment pipeline.\n   -- Network connectivity issues between the deployment service and the DataServiceClient API.\n   -- Authentication or permission issues preventing access to the required resources.\n\n2.- **Namespace or Partition-Specific Issues**:\n   -- Resource constraints or misconfigurations in the `ic3-auth-runtimeapi` namespace.\n   -- Issues specific to the `eastus-2` region or the DEV ring environment.\n\n3.- **Container Image Issues**:\n   -- The specified container image (`Cosmic Base Image`) may be missing, outdated, or incompatible with the deployment configuration.\n\n4.- **Telemetry or Logging Gaps**:\n   -- Missing telemetry data or incomplete logs can hinder the ability to diagnose the root cause effectively.\n\n---\n\n**Steps to Investigate**\n1.- **Check Deployment Logs**:\n   -- Use the COSMIC CLI to retrieve detailed logs for the failed deployment:\n     ```bash\n     cc logs <pod-name> -n ic3-auth-runtimeapi\n     ```\n   -- Alternatively, access the EV2 Portal (link provided in the issue) to review the function execution logs for the `CosmicTorusTeamValidationTrigger` activity.\n\n2.- **Validate Release Definition**:\n   -- Verify that the `CosmicReleaseDefinition` is correctly configured in the deployment pipeline. Check for missing or invalid parameters in the release definition YAML file.\n\n3.- **Test API Connectivity**:\n   -- Test the connectivity to the DataServiceClient API endpoint from the deployment environment:\n     ```bash\n     curl -v <DataServiceClient-API-Endpoint>\n     ```\n   -- Ensure that the API endpoint is reachable and responding as expected.\n\n4.- **Verify Namespace and Resource Availability**:\n   -- Check the status of the `ic3-auth-runtimeapi` namespace and ensure sufficient resources (CPU, memory) are available:\n     ```bash\n     cc get pods -n ic3-auth-runtimeapi\n     cc describe namespace ic3-auth-runtimeapi\n     ```\n\n5.- **Inspect Container Image**:\n   -- Confirm that the specified container image (`Cosmic Base Image`) exists in the Azure Container Registry (ACR) and is accessible:\n     ```bash\n     az acr repository show --name <acr-name> --repository <repository-name>\n     ```\n\n6.- **Check Permissions**:\n   -- Ensure that the deployment service has the necessary permissions to access the DataServiceClient API and other required resources. This may involve validating Azure AD role assignments or service principal configurations.\n\n7.- **Review Telemetry**:\n   -- Verify that telemetry data is being collected for the `ic3-auth-runtimeapi` namespace. Missing telemetry can indicate pipeline misconfigurations or service outages.\n\n---\n\n**Mitigation Suggestions**\n1.- **Fix Release Definition**:\n   -- If the `CosmicReleaseDefinition` is misconfigured, update the YAML file with the correct parameters and re-trigger the deployment.\n\n2.- **Restart Deployment Services**:\n   -- Restart the deployment-related services in the `ic3-auth-runtimeapi` namespace to resolve transient issues:\n     ```bash\n     cc rollout restart deployment <deployment-name> -n ic3-auth-runtimeapi\n     ```\n\n3.- **Rebuild and Push Container Image**:\n   -- If the container image is missing or outdated, rebuild the image and push it to the ACR:\n     ```bash\n     docker build -t <acr-name>.azurecr.io/<repository-name>:<tag> .\n     docker push <acr-name>.azurecr.io/<repository-name>:<tag>\n     ```\n\n4.- **Apply JIT Elevation**:\n   -- If permissions are insufficient, apply Just-In-Time (JIT) elevation to the required role (e.g., Contributor) and retry the deployment. Refer to the [JIT elevation documentation](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/securely-access-app-jit).\n\n5.- **Coordinate with the COSMIC Team**:\n   -- If the issue persists, escalate to the COSMIC team for further investigation. Provide detailed logs and telemetry data to assist in debugging.\n\n---\n\n**References**\n-- [COSMIC CLI Documentation](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/access-clusters-with-cc)\n-- [JIT Elevation Documentation](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/tools/cosmic-cli/securely-access-app-jit)\n-- [COSMIC Operation Portal (COP)](https://aka.ms/cop)\n\nBy following these steps, you should be able to identify and resolve the root cause of the deployment failure, ensuring successful submission of the release to the COSMIC DEV ring.\n\n**Date:** 2025-09-16"
    }
  },
  {
    id: 'q4',
    query: "Can you provide an overview of the COSMIC Platform?",
    modelA: {
      id: 'a4',
      model: 'Model A',
      response: "COSMIC (Containers on Substrate-Managed Intelligent Clusters) is a modern, compliant microservice platform built on top of Azure Kubernetes Service (AKS). It enables services to be built and deployed via containers, utilizing technologies like Docker and Kubernetes. COSMIC aims to standardize software delivery across Microsoft\'s Experience + Devices organization, improving agility and reducing time-to-market for features.\n\nKey Concepts:\n\n-- **Providers and Deployment:** COSMIC supports multiple clouds, including public (Worldwide), USGov (GCC), and Mooncake for China. Each deployment is segmented by silos, rings, and clusters to ensure compliance and safe deployment practices.\n-- **Namespaces and Partitions:** Services are isolated using namespaces, while partitions provide flexibility in creating service topology across different rings and regions to simplify routing and deployment.\n-- **Monitoring and Metrics:** COSMIC provides tools like Grafana dashboards to monitor services, capacity utilization, and deployment health.\n\nCOSMIC\'s foundations are built on shared software systems, ensuring compliance and streamlining partner onboarding.\n\n### References\n\n-- [COSMIC Overview](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/overview/what/COSMIC-overview)\n-- [COSMIC Basic Concepts](https://eng.ms/docs/experiences-devices/m365-core/substrate-platform/cosmic-group/partners/overview/what/COSMIC-basicConcept)"
    },
    modelB: {
      id: 'b4',
      model: 'Model B',
      response: "**Overview of the COSMIC Platform**\n\nThe COSMIC Platform is a critical infrastructure component within the Microsoft 365 Substrate, designed to manage and deploy containerized applications and services. It provides a secure, scalable, and efficient environment for both Windows and Linux runtimes, with a strong focus on security, compliance, and operational stability. The platform is built on top of Azure Kubernetes Service (AKS) and integrates deeply with Azure services to enhance its capabilities [Data: Entities (210)].\n\n---\n\n**Key Features and Capabilities**\n\n1.- **Container Orchestration and Hosting**:\n   -- COSMIC leverages AKS for hosting and orchestrating container workloads. It supports both Windows and Linux containers, with Linux capacity targeted to increase to 25% of compute cores [Data: Entities (210)].\n   -- The platform uses CBL-Mariner, a secure Linux distribution, as the underlying operating system for container hosting [Data: Entities (210)].\n\n2.- **Security and Compliance**:\n   -- COSMIC adheres to stringent security certifications, such as GCC High, and performs regular vulnerability assessments. It ensures the security and integrity of container images, including addressing vulnerabilities like CVE-2024-8096 and others [Data: Entities (210)].\n   -- The platform employs Azure Container Registry (ACR) for secure storage and management of container images [Data: Entities (210)].\n\n3.- **Namespace and Resource Management**:\n   -- Namespace management is facilitated by services like `cosmic-namespace-agent` and `cosmic-namespacemgmt-allocator`, ensuring efficient allocation and isolation of resources [Data: Entities (210)].\n\n4.- **Deployment and Configuration Management**:\n   -- Deployment workflows are streamlined through tools like MOBR, SRM, and EV2, ensuring efficient and secure deployment processes [Data: Entities (210)].\n   -- The platform integrates with GitOps workflows via FLUX, enabling automated synchronization of cluster configurations with Git repositories [Data: Reports (0)].\n\n5.- **High Availability and Disaster Recovery (HA/DR)**:\n   -- COSMIC supports HA/DR capabilities through extensions like the COSMICAppDeploymentExtension, ensuring service continuity during failures or maintenance [Data: Entities (210)].\n\n6.- **Monitoring and Incident Management**:\n   -- Platform-level monitoring is available through tools like Azure Workbooks, which provide insights into availability and operational status. Integration with IcM Alerts ensures proactive incident management [Data: Entities (9243); Reports (0)].\n\n---\n\n### Known Issues and Challenges\n\n1.- **Deployment Issues**:\n   -- Common problems include missing Managed Service Identity (MSI) configurations and deployment failures due to resource contention or DNS discrepancies [Data: Entities (210); Reports (0)].\n\n2.- **Orphan Resources**:\n   -- Orphaned Kubernetes entities, such as unused Pods and Services, can increase operational costs and interfere with new deployments. Regular cleanup is necessary to maintain cluster efficiency [Data: Reports (0)].\n\n3.- **Security Vulnerabilities**:\n   -- The platform addresses vulnerabilities in container images, such as issues with krb5, expat, curl, and glibc, through regular updates and patches [Data: Entities (210)].\n\n---\n\n### Integration with Other COSMIC Components\n\nThe COSMIC Platform is tightly integrated with other components to enhance its functionality:\n-- **FLUX**: Ensures configuration consistency through GitOps workflows [Data: Reports (0)].\n-- **Scaffolding Platform**: Automates the generation of deployment artifacts like Kubernetes manifests and Helm charts [Data: Reports (0)].\n-- **Cluster Availability Group (CAG)**: Enforces high availability policies, such as the \"one-cluster-down-at-a-time\" rule, to minimize service disruptions [Data: Reports (0)].\n\n---\n\n### Conclusion\n\nThe COSMIC Platform is a cornerstone of the Microsoft 365 Substrate, providing a robust and secure environment for managing containerized applications. Its integration with Azure services, focus on security and compliance, and support for high availability make it a reliable choice for large-scale, mission-critical workloads. However, partners must remain vigilant about known issues, such as deployment challenges and orphan resources, to ensure smooth operations.\n\n**Date:** 2025-09-16"
    }
  },
  {
    id: 'q5',
    query: "Placeholder",
    modelA: {
      id: 'a5',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b5',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q6',
    query: "Placeholder",
    modelA: {
      id: 'a6',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b6',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q7',
    query: "Placeholder",
    modelA: {
      id: 'a7',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b7',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q8',
    query: "Placeholder",
    modelA: {
      id: 'a8',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b8',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q9',
    query: "Placeholder",
    modelA: {
      id: 'a9',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b9',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q10',
    query: "Placeholder",
    modelA: {
      id: 'a10',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b10',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q11',
    query: "Placeholder",
    modelA: {
      id: 'a11',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b11',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q12',
    query: "Placeholder",
    modelA: {
      id: 'a12',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b12',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q13',
    query: "Placeholder",
    modelA: {
      id: 'a13',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b13',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q14',
    query: "Placeholder",
    modelA: {
      id: 'a14',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b14',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q15',
    query: "Placeholder",
    modelA: {
      id: 'a15',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b15',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q16',
    query: "Placeholder",
    modelA: {
      id: 'a16',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b16',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q17',
    query: "Placeholder",
    modelA: {
      id: 'a17',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b17',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q18',
    query: "Placeholder",
    modelA: {
      id: 'a18',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b18',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q19',
    query: "Placeholder",
    modelA: {
      id: 'a19',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b19',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q20',
    query: "Placeholder",
    modelA: {
      id: 'a20',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b20',
      model: 'Model B',
      response: "Placeholder"
    }
  },
  {
    id: 'q21',
    query: "Placeholder",
    modelA: {
      id: 'a21',
      model: 'Model A',
      response: "Placeholder"
    },
    modelB: {
      id: 'b21',
      model: 'Model B',
      response: "Placeholder"
    }
  }
  
]