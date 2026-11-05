const axios = require('axios');
require('dotenv').config();

const keywords= [
  `fresh+graduate`,
  `lulusan+baru`,
  `intern`,
  `internship`,
  `magang`,
  `entry+level`,
  `management+trainee`,
  `officer+development+program`,
  `odp`,
  `banker+development+program`,
  `development+program`,
  `mt`,
  `apprenticeship`,
  `staff`,
  `officer`,
  `specialist`

]




async function getDetailAndPost(jobs){
  return new Promise(async (resolve) => {
    for (let index = 0; index < jobs.length; index++) {
      console.log(`processing jobs ${index+1}/${jobs.length} `)
      await new Promise((r) => setTimeout(r, 3000));
      const response = await axios.get(`https://www.kalibrr.com/_next/data/RHBx-W8Ym0gWx0tw46C5b/id-ID/c/${jobs[index].company.code}/jobs/${jobs[index].id}/${jobs[index].slug}.json?code=${jobs[index].company.code}&param=${jobs[index].id}&param=${jobs[index].slug}`)

      try {
        if (response.data) {
          const{pageProps} = response.data
          if (pageProps) {
            const {job} = pageProps
             try{
                const ress = {
                      job_title: job.name,
                      company_logo: job.company.logo,
                      company_name: job.company.name,
                      company_location: job.googleLocation.formattedAddress,
                      company_url: job.company.url? job.company.url :`https://example.com/`,
                      job_description: job.description,
                      schedule_type:'-',
                      job_url: `${`https://www.kalibrr.com/id-ID/c/${jobs[index].company.code}/jobs/${jobs[index].id}/${jobs[index].slug}`}`,
                    }
                    
                    await axios.post(
                      'https://api.example.com/jobs', 
                      ress,
                      {
                        headers: {
                          'Content-Type': 'application/json',
                          'token': process.env.INGEST_API_TOKEN
                        }
                      }
                    )
                } catch (error) {
                  
                }      
          }else{
            continue;
          }
          
         

          continue;
        }

        
      } catch (error) {
        continue;
        
      }
      
    }
    return resolve('all data processed')


  })
 
 
  // try {
  //   const job = {
  //     job_title: jobs_title[index],
  //     company_logo: company_logos[index],
  //     company_name: company_title[index],
  //     company_location: jobLocation[index],
  //     company_url: `https://example.com/`,
  //     job_description: job_desc,
  //     schedule_type:'-',
  //     job_url: `${detail_url[index]}`,
  //   }
  //   // console.log(a,job)
  //   // records.push(job);
  //   await axios.post(
  //     'https://api.example.com/jobs', 
  //     job,
  //     {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'token': process.env.INGEST_API_TOKEN
  //       }
  //     }
  //   )
  // } catch (error) {
    
  // }
}

async function getAllData(limit,keywords){

  return new Promise(async (resolve) => {
    try {
      const response =  await axios.get(
        `https://www.kalibrr.com/kjs/job_board/search?limit=${limit}&offset=0&text=${keywords}&country=Indonesia`
      )
  
      if (response.data) {
        const {count,jobs} = response.data
        console.log(jobs[0].company.code)
        const result = await getDetailAndPost(jobs)
        return resolve(result)
      }else{
        return resolve('failed')
      }
    } catch (error) {
      console.log(error)
      return resolve(result)
    }
  })
 
}

async function startScrap(){
  for(let a = 0; a < keywords.length; a++){

    try {
      const response =  await axios.get(
        `https://www.kalibrr.com/kjs/job_board/search?limit=15&offset=0&text=${keywords[a]}&country=Indonesia`
      )
  
      if (response.data) {
        const {count} = response.data
        const result = await getAllData(count,keywords[a])
        console.log(result)
        
      }else{
        continue;
      }
    } catch (error) {
      console.log(errpr)
     
    }
   
  }
}

module.exports = startScrap;