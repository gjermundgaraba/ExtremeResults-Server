# API

## Outcomes

### GET /api/outcomes
Implemented

### POST /api/outcomes
Implemented

### GET /api/outcomes/:outcomeId
Implemented

### PUT /api/outcomes/:outcomeId
Implemented

### DELETE /api/outcomes/outcomeId
Implemented



## Reflections

### GET /api/reflections
Implemented

### POST /api/reflections
Implemented

### GET /api/reflections/:reflectionId
Implemented

### PUT /api/reflections/:reflectionId
Implemented

### DELETE /api/reflections/:reflectionId
Implemented



## Related

### GET /api/related/outcomes?typeName=outcomeType
Implemented
Function to get all related entries for outcomes of type typeName

Daily:
Current Monday Vision (Weekly outcome) if any.

Weekly:
Last Friday Reflection if any.


### GET /api/related/reflections?typeName=reflectionType
Not Implemented
Function to get all related entries for reflections of type typeName

Weekly:
Last Friday Reflection (Weekly Reflection) if any.


## HotSpotBuckets

### GET /api/hotspotbuckets
Implemented

### POST /api/hotspotbuckets
Implemented

### PUT /api/hotspotbuckets/:hotspotBucketId
Implemented

### DELETE /api/hotspotbuckets/:hotspotBucketId
Implemented


## Functions

Special functions that are not directly tied to a data type

### GET /api/activeEntries
Implemented

### DELETE /api/forTest
Not Implemented
Used for e2e tests only!
This API is never going into production. It is needed on test server to clear the database between e2e test runs.
If we can find a better way to do this (perhaps without clearing users? Don't know about that...) that would be best. 
I don't like this API too much.



### Login
Not Implemented

### Register
Not Implemented
Need to make sure new users have some default hotspotBuckets with hotspots
