import { apiClient } from '~/api/client';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  
  // Always set the API base URL from the runtime config
  const baseUrl = config.public.apiBaseUrl;
  
  // Update the API client with the base URL
  apiClient.updateBaseUrl(baseUrl);
  
  console.log('API client initialized with base URL:', baseUrl);
});
