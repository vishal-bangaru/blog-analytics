const exp=require('express')
const axios = require('axios');
const _=require('lodash')
const app=exp()
app.use(exp.json())
let blogs=[]

//Middleware for data retrieval
const middleware=async(req,res,next)=>{
const url = 'https://intent-kit-16.hasura.app/api/rest/blogs';
const headers = {
  'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
};
try{
const response=await axios({
  method: 'get',
  url: url,
  headers: headers
})
blogs=[...response.data.blogs]
app.set("data",blogs)
}
 catch(error){
    console.error('Error in making request:', error);
}
next()
}

//All the errors in the routes can be handled by the errorHandlingMiddleware
const errorHandlingMiddleware=(error,req,res,next)=>{
  
  res.send({message:error.message})
}

//Data Analysis and Response
app.get("/api/blog-stats",middleware,(req,res)=>{
  
  const blogs=app.get("data")
  totalBlogs=blogs.length
  longestTitleBlog=_.maxBy(blogs,(o)=>o.title.length)
  const blogsWithPrivacy = _.filter(blogs, (blog) =>
  blog.title.toLowerCase().includes('privacy')
  );
const uniqueTitles = _.uniqBy(blogs, 'title');
res.send({
  total:totalBlogs,
  longestTitle:longestTitleBlog.title,
  blogswithprivacy: blogsWithPrivacy.length,
  uniquetitles: uniqueTitles.map((blog) => blog.title)
});
 

})

//Blog Search Endpoint 
app.get("/api/blog-search",(req,res)=>{
  
  const blogs=app.get("data")
   const query=req.query.search_query
   const searchResults = blogs.filter((blog) =>
   blog.title.toLowerCase().includes(query.toLowerCase())
 );
 res.send({ results: searchResults });
 
 
})

app.use(errorHandlingMiddleware)
app.listen(8080,()=>{
    console.log("Server running on 8080")
})

