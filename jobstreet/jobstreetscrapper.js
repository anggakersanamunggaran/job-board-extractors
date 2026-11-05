const puppeteer = require('puppeteer');
const fs = require('fs');
const axios = require('axios');

const keywords= [
  `fresh-graduate-jobs`,
  `Lulusan-baru-jobs`,
  `Intern-jobs`,
  `Internship-jobs`,
  `Magang-jobs`,
  `Entry-Level-jobs`,
  `Management-Trainee-jobs`,
  `Officer-Development-Program-jobs`,
  `ODP-jobs`,
  `Banker-Development-Program-jobs`,
  `Development-Program-jobs`,
  `MT-jobs`,
  `Apprenticeship-jobs`,
  `Staff-jobs`,
  `Officer-jobs`,
  `Specialist-jobs`

]

async function reRunScrapper(keywords,totalPages,current_pages=2){
  return new Promise(async (resolve) => {
    // Simulating an asynchronous operation (e.g., setTimeout)
    await new Promise((r) => setTimeout(r, 5000));
    const browser = await puppeteer.launch({ headless: 'old' });
    const page = await browser.newPage();
    await page.goto(`https://www.jobstreet.co.id/id/${keywords}?page=${current_pages}`,{ waitUntil: 'networkidle0' });
    await page.setDefaultNavigationTimeout(0);
    var fileName = current_pages+'_'+keywords+'.json';
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
    const totalJobs = await page.evaluate(()=>
      document.querySelector('[data-automation="totalJobsCount"]').textContent
    )
    console.log(totalJobs,'totalJobsnya')
    let jobs_post = 0;
    if (totalJobs) {
      jobs_post = parseInt(totalJobs.replace(/,/g, ''), 10)
    }

    const jobsIds = await page.evaluate(() => 
      Array.from(document.querySelectorAll("article")).map(d => d.getAttribute("data-job-id"))
    );

    const company_logos = await page.evaluate(() => 
    Array.from(document.querySelectorAll('[data-testid="bx-logo-image"]')).map(divElement=>{
      const imgElement = divElement.querySelector('img')
      return imgElement ? imgElement.src : 'https://example.com/logo.png'
    })
    )
    // let images_array = []
    // const company_logos = await page.$eval('img', (images) => { images_array.push(images.src) });


    console.log(company_logos,'logos')
    const jobs_title= await page.evaluate(() => 
      Array.from(document.querySelectorAll('[data-automation="jobTitle"]')).map(res=>res.textContent)
    )
    // console.log(jobs_title,'title')
    const company_title= await page.evaluate(() => 
      Array.from(document.querySelectorAll('[data-automation="jobCompany"]')).map(res=>res.textContent)
    )
    const jobLocation= await page.evaluate(() => 
      Array.from(document.querySelectorAll('[data-automation="jobLocation"]')).map(res=>res.textContent)
    )
    
    var records = [];
    await browser.close();
    for(let index = 0; index < jobsIds.length; index++){
    
      console.log(keywords)
      console.log(current_pages)
      const job_desc = await getDescriptionJob(`https://www.jobstreet.co.id/id/job/${jobsIds[index]}`)
      
      // records.push({
      //   job_title: jobs_title[index],
      //   company_logo: company_logos[index],
      //   company_title: company_title[index],
      //   job_location: jobLocation[index],
      //   job_url: `https://www.jobstreet.co.id/id/job/${jobsIds[index]}`,
      //   job_description:job_desc,
      // });
      try {
        const job = {
          job_title: jobs_title[index],
          company_logo: company_logos[index],
          company_name: company_title[index],
          company_location: jobLocation[index],
          company_url: `-`,
          job_description: job_desc,
          schedule_type:'-',
          job_url: `https://www.jobstreet.co.id/id/job/${jobsIds[index]}`,
        }
        // console.log(a,job)
        // records.push(job);
        await axios.post(
          'https://api.example.com/jobs', 
          job,
          {
            headers: {
              'Content-Type': 'application/json',
              'token': process.env.INGEST_API_TOKEN
            }
          }
        )
      } catch (error) {
        
      }
      
    }

    // const orla_data_json = records;
    // fs.writeFileSync('results/'+fileName, JSON.stringify(orla_data_json));

    if (jobsIds.length >= 32) {
        
        if (totalPages >= current_pages+1) {
          reRunScrapper(keywords,totalPages,current_pages+1)
        }else{
          resolve()
        }

        
      }
    
  });

  

}


async function runScraper() {
  for(let a = 0; a < keywords.length; a++){
    await new Promise((r) => setTimeout(r, 5000));
    const browser = await puppeteer.launch({ headless: 'old' });
    const page = await browser.newPage();
    await page.goto(`https://www.jobstreet.co.id/id/${keywords[a]}`,{ waitUntil: 'networkidle0' });
    await page.setDefaultNavigationTimeout(0);
   
    var fileName = 1+'_'+'fresh-graduate-jobs'+'.json';
    
    if (fs.existsSync(fileName)) {
      fs.unlinkSync(fileName);
    }
  
    const totalJobs = await page.evaluate(()=>
      document.querySelector('[data-automation="totalJobsCount"]').textContent
    )
    console.log(totalJobs,'totalJobsnya')
    let jobs_post = 0;
    if (totalJobs) {
      jobs_post = parseInt(totalJobs.replace(/,/g, ''), 10)
    }
    console.log(jobs_post,'jobs_post')
  
    const jobsIds = await page.evaluate(() => 
      Array.from(document.querySelectorAll("article")).map(d => d.getAttribute("data-job-id"))
    );
  
    console.log(jobsIds,'jobsIdsNyA')
    console.log(jobsIds.length,'perpage')
    const company_logos = await page.evaluate(() => 
     Array.from(document.querySelectorAll('[data-testid="bx-logo-image"]')).map(divElement=>{
      const imgElement = divElement.querySelector('img')
      return imgElement ? imgElement.src : null
     })
    )
    // const company_logos = await page.evaluate(()=>{
    //   Array.from(document.getElementsByTagName('img'))
    // })
    // let images_array = []
    // const company_logos = await page.$eval('img', (images) => { images_array.push(images.src) });
  
  
    
    const jobs_title= await page.evaluate(() => 
      Array.from(document.querySelectorAll('[data-automation="jobTitle"]')).map(res=>res.textContent)
    )
  
    const company_title= await page.evaluate(() => 
      Array.from(document.querySelectorAll('[data-automation="jobCompany"]')).map(res=>res.textContent)
    )
    const jobLocation= await page.evaluate(() => 
      Array.from(document.querySelectorAll('[data-automation="jobLocation"]')).map(res=>res.textContent)
    )
    
    var records = [];
    await browser.close();
  
    // for(let index = 0; index < jobsIds.length; index++){
     
    //   console.log(index);
    //   console.log(keywords[a],'keywordsnya')
    //   const job_desc = await getDescriptionJob(`https://www.jobstreet.co.id/id/job/${jobsIds[index]}`)
      
    //   // records.push({
    //   //   job_title: jobs_title[index],
    //   //   company_logo: company_logos[index],
    //   //   company_title: company_title[index],
    //   //   job_location: jobLocation[index],
    //   //   job_url: `https://www.jobstreet.co.id/id/job/${jobsIds[index]}`,
    //   //   job_description:job_desc,
    //   // });
    //   try {
    //     const job = {
    //       job_title: jobs_title[index],
    //       company_logo: company_logos[index],
    //       company_name: company_title[index],
    //       company_location: jobLocation[index],
    //       company_url: `https://example.com/`,
    //       job_description: job_desc,
    //       schedule_type:'-',
    //       job_url: `https://www.jobstreet.co.id/id/job/${jobsIds[index]}`,
    //     }
    //     // console.log(a,job)
    //     // records.push(job);
    //     await axios.post(
    //       'https://api.example.com/jobs', 
    //       job,
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'token': process.env.INGEST_API_TOKEN
    //         }
    //       }
    //     )
    //   } catch (error) {
        
    //   }
      

    // }
    
  
    
    
  
    // const orla_data_json = records;
    // fs.writeFileSync('results/'+fileName, JSON.stringify(orla_data_json));
  
    if (jobsIds.length >= 32) {
      const totalPages = jobs_post/jobsIds.length
      await  reRunScrapper(keywords[a],totalPages-1,80)
      
  
    }
  


  

  
  // nanti result nya tuh [kumpulin job id]
  // terus gunakan job id nya ya 
  // contoh urlnya  https://www.jobstreet.co.id/id/job/71961501 https://www.jobstreet.co.id/id/job/${job_id}
  }
}

async function getDescriptionJob(url){
  console.log(url,'urlnya')
  await new Promise((r) => setTimeout(r, 5000));
  const browser = await puppeteer.launch({ headless: 'old' });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  await page.goto(url,{ waitUntil: 'domcontentloaded' });
  const job_description= await page.evaluate(() => 
    document.querySelector('[data-automation="jobAdDetails"]') !== null ? document.querySelector('[data-automation="jobAdDetails"]').innerText : '-'
  )
  console.log(job_description,'job_desc')
  await browser.close();
  return job_description;
}

module.exports = runScraper;