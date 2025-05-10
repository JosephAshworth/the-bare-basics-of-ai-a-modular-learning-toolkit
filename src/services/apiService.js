// this file contains the API service for the application. It is used to make HTTP requests to the backend. It also handles the authentication and error handling for the requests

import axios from 'axios'; // import axios, this is used to make HTTP requests

import { auth } from '../firebase'; // import the auth object from the firebase file

export const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // set the backend url to the backend url in the environment variables, or localhost:5000 if not set

console.log(`API Service initialised with backend URL: ${backendUrl}`); // log the backend url

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // sleep for a given number of milliseconds

const apiInstance = axios.create({ // create an instance of axios
  baseURL: backendUrl, // set the base url to the backend url
  timeout: 30000, // set the timeout to 30 seconds, in case a request takes longer than 30 seconds
  withCredentials: true, // ensures that cookies (such as session or authentication tokens) are sent with cross-origin requests
});

apiInstance.interceptors.request.use( // interceptor for the request, this is used to add the authentication token to the request
  async (config) => { // async function to handle the request
    if (config.url && (config.url.includes('/start-timer') || config.url.includes('/stop-timer'))) { // if the url includes the start-timer or stop-timer endpoints
      config.isTimerRequest = true; // flag the request as a timer-related operation for later use
    }
    
    const currentUser = auth.currentUser; // get the current user
    if (currentUser) { // if there is a current user
      try {
        console.log('Interceptor: Getting fresh token...'); // log the message
        const token = await currentUser.getIdToken(true); // get the fresh token
        config.headers.Authorization = `Bearer ${token}`; // add the token to the headers
        console.log('Interceptor: Fresh token added to headers.'); // log the message
      } catch (error) { // catch the error
        console.error('Interceptor: Error refreshing token:', error); // log the error
        delete config.headers.Authorization; // remove the token from the headers
      }
    } else {
      delete config.headers.Authorization; // remove the token from the headers
      console.log('Interceptor: No user logged in, removing auth header.'); // log the message
    }

    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data ? config.data : ''); // log the request for the config method and url, and the data if it exists
    return config; // return the config
  },
  (error) => { // error handler: runs if an error occurs during the request (such as a network error or invalid request)
    console.error('Request Error Interceptor:', error); // log the error for debugging purposes
    return Promise.reject(error); // reject the promise to propagate the error, so it can be handled elsewhere
  }
);

apiInstance.interceptors.response.use( // response interceptor: runs if a response is received from the server
  (response) => { // response handler: runs if a response is received from the server
    console.log(`API Response: ${response.status}`, response.data); // log the response for the status and data
    return response; // return the response
  },
  (error) => { // error handler: runs if an error occurs during the response (such as a network error or invalid response)
    console.error('Response Error:', error.response ? error.response.data : error.message); // log the error for debugging purposes
    
    const isInvalidTokenError = error.response && // check if the error response is valid
                              error.response.data && // check if the error response data is valid
                              error.response.data.error === "Invalid authentication token"; // check if the error response data error is "Invalid authentication token"
    
    if (error.config && // check if the error config is valid
        error.config.url && // check if the error config url is valid
        (error.config.url.includes('/start-timer') || error.config.url.includes('/stop-timer'))) { // check if the error config url includes the start-timer or stop-timer endpoints
      
      let clientElapsedTime = 0; // initialise the client elapsed time to 0
      if (error.config.data) { // check if the error config data is valid
        try { // try to parse the error config data
          const requestData = JSON.parse(error.config.data); // parse the error config data
          clientElapsedTime = requestData.clientElapsedTime || 0; // set the client elapsed time to the request data client elapsed time, or 0 if it is not present
          if (clientElapsedTime > 0) { // if the client elapsed time is greater than 0
            console.log(`Preserving client elapsed time of ${clientElapsedTime}s in error handler`); // log the message
          }
        } catch (e) { // catch the error
          console.error('Error parsing request data:', e); // log the error
        }
      }
      
      if (error.response && (error.response.status === 401 || isInvalidTokenError)) { // check if the error response is valid, and if the error response status is 401, or if the isInvalidTokenError is true
        console.log('Timer operation with auth error - silently succeeding'); // log the message
        return Promise.resolve({ // return a promise with the success, message, and client elapsed time
          data: { 
            success: true, // set the success to true
            message: "Timer handled locally", // set the message to "Timer handled locally"
            clientElapsedTime // The elapsed time tracked on the client-side (such as the time the user spent before sending the request)
          },
          status: 200 // set the status to 200 to indicate a successful operation
        });
      }
    }
    
    if (isInvalidTokenError) { // check if the isInvalidTokenError is true
      console.log('Silencing "Invalid authentication token" error for regular request'); // log the message
      return Promise.resolve({ // return a promise with the success, message, and client elapsed time
        data: { success: true }, // set the success to true
        status: 200 // set the status to 200 to indicate a successful operation
      });
    }
    
    return Promise.reject(error); // reject the promise to propagate the error, so it can be handled elsewhere
  }
);

const makeRequestWithRetry = async (requestFn, maxRetries = 3, retryDelay = 1000) => { // make a request with retry: async function to handle the request with retry, with a default of 3 retries and a 1 second delay between retries
  let retries = 0; // initialise the retries to 0
  
  const isTimerRequest = (config) => { // check if the request is a timer request
    if (!config) return false; // if the config is not valid, return false
    
    if (config.url && ( // check if the config url is valid
      config.url.includes('/start-timer') || // and if the config url includes the start-timer endpoint
      config.url.includes('/stop-timer') || // or the stop-timer endpoint
      config.url.includes('/module-timer') // or the module-timer endpoint
    )) {
      return true; // return true if the config url includes the start-timer, stop-timer, or module-timer endpoints
    }
    
    if (config.isTimerRequest) { // check if the config isTimerRequest is true
      return true; // return true if the config isTimerRequest is true
    }
    
    return false; // return false if the config is not a timer request
  };
  
  const extractClientElapsedTime = (config) => { // extract the client elapsed time from the config
    if (!config || !config.data) return 0; // if the config is not valid, or the config data is not valid, return 0
    
    try { // try to parse the config data
      if (typeof config.data === 'object') { // check if the config data is an object
        return config.data.clientElapsedTime || 0; // return the client elapsed time from the config data, or 0 if it is not present
      }
      
      const data = JSON.parse(config.data); // parse the config data
      return data.clientElapsedTime || 0; // return the client elapsed time from the config data, or 0 if it is not present
    } catch (e) { // catch the error
      console.error('Error extracting clientElapsedTime:', e); // log the error
      return 0; // return 0 if there is an error
    }
  };
  
  while (retries < maxRetries) { // while the retries are less than the max retries
    try { // try to make the request
      return await requestFn(); // return the request
    } catch (error) { // catch the error
      const isAuthError = error.response && error.response.status === 401; // check if the error response status is 401
      
      const timerRequest = isTimerRequest(error.config); // check if the error config is a timer request
      
      if (timerRequest) { // check if the timer request is true
        console.log('Timer request encountered error, checking if we should continue...'); // log the message
        
        const clientElapsedTime = extractClientElapsedTime(error.config); // extract the client elapsed time from the error config
        if (clientElapsedTime > 0) { // check if the client elapsed time is greater than 0
          console.log(`Found client elapsed time of ${clientElapsedTime}s in failed request`); // log the message
        }
        
        if (isAuthError || // check if the isAuthError is true
           (error.response && error.response.data && // or if the error response and the error response data is valid
            error.response.data.error === "Invalid authentication token")) { // and if the error response data error is "Invalid authentication token"
          
          console.log('Timer request with auth error - returning success immediately'); // log the message
          return { 
            data: { 
              success: true, // set the success to true
              message: "Timer operation processed locally", // set the message to "Timer operation processed locally"
              clientElapsedTime // The elapsed time tracked on the client-side (such as the time the user spent before sending the request)
            },
            status: 200 // set the status to 200 to indicate a successful operation
          };
        }
        
        if (retries >= maxRetries - 1) { // check if the retries are greater than or equal to the max retries minus 1
          console.log('Reached max retries for timer request - returning success anyway'); // log the message
          return { 
            data: { 
              success: true, // set the success to true
              message: "Timer operation processed locally after retry failure", // set the message to "Timer operation processed locally after retry failure"
              clientElapsedTime // The elapsed time tracked on the client-side (such as the time the user spent before sending the request)
            },
            status: 200 // set the status to 200 to indicate a successful operation
          };
        }
      }
      
      if (isAuthError) { // check if the isAuthError is true
        retries++; // increment the retries
        console.log(`Authentication error (401), retry attempt ${retries} of ${maxRetries}...`); // log the message
        
        await sleep(retryDelay * retries); // sleep for the retry delay multiplied by the retries, to avoid overwhelming the server
        
        if (retries >= maxRetries) { // check if the retries are greater than or equal to the max retries
          console.error(`Maximum retry attempts (${maxRetries}) reached for auth error`); // log the message
          
          if (timerRequest) { // check if the timer request is true
            const clientElapsedTime = extractClientElapsedTime(error.config); // extract the client elapsed time from the error config
            return { 
              data: { 
                success: true, // set the success to true
                message: "Timer operation processed locally", // set the message to "Timer operation processed locally"
                clientElapsedTime // The elapsed time tracked on the client-side (such as the time the user spent before sending the request)
              },
              status: 200 // set the status to 200 to indicate a successful operation
            };
          }
          
          throw error; // re-throw the error so it can be caught and handled by higher-level error handling (such as in a catch block)
        }
        
        continue; // continue the loop
      }
      
      throw error; // re-throw the error so it can be caught and handled by higher-level error handling (such as in a catch block)
    }
  }
};

const apiService = { // api service object: contains the methods for the api service
  get: (endpoint, config = {}) => { // get method: makes a GET request to the endpoint with the config
    console.log(`Making GET request to ${endpoint}`); // log the message
    
    return makeRequestWithRetry(() => { // make a request with retry
      console.log(`Executing GET request to ${endpoint} with config:`, config); // log the message
      return apiInstance.get(endpoint, config); // return the request
    }).then(response => { // then: handle the response
      console.log(`GET request to ${endpoint} successful:`, response.status); // log the message
      return response; // return the response
    }).catch(error => { // catch: handle the error
      console.error(`GET request to ${endpoint} failed:`, error); // log the error
      throw error; // re-throw the error so it can be caught and handled by higher-level error handling (such as in a catch block)
    });
  },
  
  post: (endpoint, data, config = {}) => { // post method: makes a POST request to the endpoint with the data and config
    if (endpoint.includes('/start-timer') || endpoint.includes('/stop-timer')) { // check if the endpoint includes the start-timer or stop-timer endpoints
      console.log(`Special handling for timer endpoint: ${endpoint}`); // log the message
      
      return makeRequestWithRetry( // make a request with retry
        () => apiInstance.post(endpoint, data, { // make a post request to the endpoint with the data and config
          ...config, // spread the config
          timeout: 3000, // set the timeout to 3000 milliseconds
        }), 
        5, // set the max retries to 5
        300 // set the retry delay to 300 milliseconds
      ).catch(error => { // catch: handle the error
        console.warn(`Timer request failed after all retries: ${endpoint}`, error); // log the error
        
        const clientElapsedTime = data && data.clientElapsedTime ? data.clientElapsedTime : 0; // extract the client elapsed time from the data
        
        if (clientElapsedTime > 0) { // check if the client elapsed time is greater than 0
          console.log(`Timer request failed but elapsed time was ${clientElapsedTime}s`); // log the message
        }
        
        return { 
          data: { 
            success: true, // set the success to true
            message: "Timer operation processed locally", // set the message to "Timer operation processed locally"
            clientElapsedTime // The elapsed time tracked on the client-side (such as the time the user spent before sending the request)
          },
          status: 200 // set the status to 200 to indicate a successful operation
        };
      });
    }

    let requestConfig = { ...config }; // create a request config object
    if (endpoint === '/api/train-model') { // check if the endpoint is the train-model endpoint
      console.log(`Applying long timeout for ${endpoint}`); // log the message
      requestConfig = {
        timeout: 300000, // set the timeout to 300000 milliseconds (5 minutes), as the model training can take a while
        ...config, // spread the config
      };
    }
    
    return makeRequestWithRetry(() => apiInstance.post(endpoint, data, requestConfig)); // make a request with retry
  },
  
  put: (endpoint, data, config = {}) => { // put method, makes a PUT request to the endpoint with the data and config
    return makeRequestWithRetry(() => apiInstance.put(endpoint, data, config)); // make a request with retry
  },
  
  delete: (endpoint, config = {}) => { // delete method, makes a DELETE request to the endpoint with the config
    return makeRequestWithRetry(() => apiInstance.delete(endpoint, config)); // make a request with retry
  },
  
  uploadFile: (endpoint, formData, config = {}) => { // upload file method, makes a POST request to the endpoint with the form data and config
    const uploadConfig = { // create a upload config object
      ...config, // spread the config
      headers: { // set the headers
        'Content-Type': 'multipart/form-data', // set the content type to multipart/form-data, as the form data is a multipart form data
        ...config.headers // spread any additional headers from the config object
      },
    };
    
    console.log(`Uploading file to: ${backendUrl}${endpoint}`); // log the message
    
    if (formData) { // check if the form data is valid
      console.log('FormData keys:'); // log the message
      for (let key of formData.keys()) { // loop through the form data keys
        console.log(`- ${key}: ${formData.get(key) ? 'value present' : 'no value'}`); // log the message
      }
    } else {
      console.error('FormData is null or undefined'); // log the message
    }
    
    return makeRequestWithRetry(() => apiInstance.post(endpoint, formData, uploadConfig)) // make a request with retry
      .catch(error => { // catch: handle the error
        console.error('Upload file error details:', { // log the error details
          status: error.response?.status, // log the status
          statusText: error.response?.statusText, // log the status text
          data: error.response?.data, // log the data
          message: error.message // log the message
        });
        throw error; // re-throw the error so it can be caught and handled by higher-level error handling (such as in a catch block)
      });
  },
  
  getFullUrl: (endpoint) => { // get full url method, returns the full url for the endpoint
    const url = `${backendUrl}${endpoint}`; // create a url object
    console.log(`Full URL: ${url}`); // log the message
    return url; // return the url
  },
  
};



export default apiService; // export the api service, so it can be used in other files
