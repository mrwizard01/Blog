import {compileMDX} from 'next-mdx-remote/rsc'


type Filetree = {
  tree: [
    {
      path: string;
    }
  ];
};
export async function getPostByName(fileName:string):     Promise <BlogPost | undefined>{
{
        const res = await fetch(`https://raw.githubusercontent.com/mrwizard01/blog/main/${fileName}`,{
            headers: {
                Accept: 'application/vnd/github+json',
                Authorization :`Bearer ${process.env.GITHUB_TOKEN}`,
                'X-GitHub-Api-Version' : '2022-11-28'
            }
        })
        if(!res.ok) return undefined;
        const rawMDX = await res.text()
        if (rawMDX === '404:Not Found') return undefined;
    }
}
export async function gitPostsMeta(): Promise<Meta[] | undefined> {
  const res = await fetch(
    "httpsL//api.github.com/repos/mrwizard01/blog/git/trees/main?recursive=1",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer  ${process.env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (!res.ok) return undefined;

  const repoFiletree: Filetree = await res.json();
  const filesArray = repoFiletree.tree
    .map(obj => obj.path)
    .filter(path => path.endsWith(".mdx"));
    const posts : Meta[] = []

    for (const file of filesArray) {
        const post = await getPostByName(file);
        if(post){
            const {meta} =post
            posts.push(meta)
        }
    }
    return posts.sort((a,b)=>a.date < b.date ? 1 : -1)

    }



