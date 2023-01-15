import {faker} from '@faker-js/faker'
import dotenv from "dotenv"
import { PrismaClient } from '@prisma/client'
dotenv.config()

const prisma = new PrismaClient();

dotenv.config()

async function addCompany() {
    try {

        await prisma.platform.create({
            data:{
                name: faker.company.name(),
                link: faker.internet.url(),
                description: faker.company.bs()
            }
        })
    } catch (error) {
        console.log(error)
    }    
}

// for (let i = 0; i < 100; i++) {
//     addCompany()
// }


async function getPlatformIds() {
    const request = await prisma.platform.findMany({
        select:{id:true},
        take:100
    })
    const idArray: string[] = request.map(item => item.id);
    return(idArray)
}

// getPlatformIds()

const ids = [
    '016a2286-89a6-4749-b053-e861dc9dd91a',
    '035734c3-25de-4ac4-b4db-079e23489e0f',
    '03c3f9a1-b1f3-404b-a550-b6202052c0bb',
    '03c89b69-20cb-4640-ba13-f18c0aac3ace',
    '048d6996-981d-4d7c-bb74-9575a5c7c661',
    '0c4a92e1-8371-466e-9ddc-db5f47191000',
    '112d3b30-5dfa-4215-b15e-ab96b1bd1f95',
    '12ddaae3-1475-47e7-972a-d5779ec8063e',
    '16d960ac-958f-4606-a5f7-cd45a7f4b603',
    '16ec4f19-a979-499b-9e82-310781c092a3',
    '1ac71b04-3153-4959-be39-e60e4f379d73',
    '1b383264-41cc-412f-9d1f-cfb27eb91427',
    '1e6745e2-f5d8-49e2-b69e-13e1dc3c80d9',
    '22705e7b-efb2-40ea-ae7c-4f62bf0daa1a',
    '25bc346f-701d-40ba-81ae-cf7ed6566aad',
    '261ead23-fabc-474b-8905-ae0ec9af3da6',
    '26f20ac7-f4a2-4f37-8085-aa81c6bbf5b9',
    '279a68b3-b8e2-4247-b10f-8b7a1461d1aa',
    '28063eea-613e-486c-b0fc-d8a88861a8c9',
    '28c818ac-d1d6-46be-ac72-ec1ffee5e0a5',
    '28f84a58-3747-4e0b-89da-d7a2f25ff6a9',
    '2c5b1468-1a62-444e-8694-8ecc1292a43f',
    '2df2ce36-4989-4fb7-a337-9d9ac2adc774',
    '32bdb1aa-1b35-4d24-a634-0763893ebd0c',
    '3371e42c-fe63-4457-8722-75da8e77ebd9',
    '346f4583-d7c7-455f-9cc0-d2f48225486e',
    '37dd55da-28f9-416f-a6a7-fc31dd70c72c',
    '3d42ab64-4c4e-4826-93b3-0efe3d174fe9',
    '40279983-4654-4fc5-8073-af6da2e3d1cf',
    '424e5c2d-7f58-4608-9b9f-77b845df1d52',
    '495f2c01-94b7-42d6-984e-25de0e194fb5',
    '4b18469e-e7fd-48d1-b3d7-687e82c9ecf0',
    '4ff7b385-eedb-48c5-9713-f8520354a53f',
    '508c508c-8c11-47ee-aa6e-81ce6e67dfa9',
    '52f03040-e620-4b98-9a34-e0e98d2413b7',
    '5776c98b-443f-40f4-bdc6-488cf1af4e1d',
    '57ccde0b-7f08-46d0-818d-9067d40f6c6b',
    '58087ad3-97f9-4079-a0e2-81de2d07c901',
    '5b35e939-c8df-4bc0-b8e6-468ca0287ff9',
    '5fa65bbd-fd9c-4883-8824-5e7e4cfd3bc3',
    '61568588-7cce-452e-9937-0e5d5a6ca527',
    '64373ebc-c697-4512-ac24-7b4e3d889ad9',
    '6834c8b5-333b-4160-9647-d1ea43fcb5f0',
    '6ae59029-d5f5-4fdc-b43e-560673f69184',
    '6b7ffc85-deae-475e-b44f-f6a86439cccd',
    '6c23b303-b3e9-41a9-ae3b-42ece1e6fe6b',
    '6d1da86e-72f9-44f4-af03-9cbdd1a499b5',
    '6fdeb8d6-c85d-4e34-9025-75efb2f594e8',
    '716668c1-62e2-4962-a100-f1730db445b6',
    '76f108df-772c-4b61-8580-9a43a89d72a6',
    '78a2b032-aa8e-49c0-b964-a5339c75c030',
    '806b0ed7-a285-4d7b-b887-8d167e7b2090',
    '877f1bd9-73db-43ec-81b7-5b9eb9839afe',
    '88b1571e-b6a9-4d3f-86c4-e9154da5ac32',
    '8b13f01d-45fe-47cb-922d-7c8868d3ace5',
    '8ec367f1-129b-4414-91bd-88f16487dd10',
    '918e6225-14e6-45c4-a45f-84b4fd2ee214',
    '93ec59e5-4f07-400d-a5f2-67fe662bf5f3',
    '97aec752-cc97-45e8-aff0-09fcc77ac9b2',
    '97d4d982-2360-41bc-9932-2612d2a8cf45',
    '9bb3c66d-0b0b-4746-97d1-5788b72406c7',
    'a0ca9982-d2d2-4dcc-a7dd-a2db8f7c2943',
    'a31594ed-c188-4820-b6e0-a7bf078090e3',
    'a4474430-de4c-491d-b5d0-a07f4f51809e',
    'a5532011-42b6-4b5a-91b2-6dd645196066',
    'b0195d71-e65a-4a03-afc3-1f3d6d26e8a9',
    'b0ada6bf-bc58-46fe-a312-8f7b33fac52c',
    'b6a9b202-b29e-410c-ba0c-075af492aaa8',
    'b91b7c77-c2ae-49b9-a70b-efb069eb0ab2',
    'b9f3f371-e9f5-4ba4-9de9-55f3058ae495',
    'bf77ab3e-d143-40b2-b832-6d8318dfe3f6',
    'c1628dde-8e09-4fe1-8501-d459256a6003',
    'c1773f21-0001-4d3c-b748-1b661bbd25e9',
    'c1be9470-ac03-4425-981f-84ff3413a6c8',
    'c25c92d6-5349-4417-8c50-4d7eac012738',
    'c38af830-6be6-4573-ac67-980d0827c2f9',
    'c7e997da-a284-4384-b296-8dbb9cfed59e',
    'c9c5f7b0-8dc1-49e7-af92-6e59ef57b4bb',
    'caa5ea29-4ff8-47c1-87d9-a8000f4d4d31',
    'caf91b24-896f-4804-a4e7-713da1bd872e',
    'cc51dd36-5f05-4c2d-9fad-68f14af47f39',
    'cd092463-7798-4f9b-81b8-43d51adc69be',
    'cf8aa4aa-8a4d-4e01-8a6b-fb3c32c589bf',
    'cf98f60d-bf8f-42e2-9e1e-9cde5bf2f7cc',
    'd0c16028-5b5b-462a-9824-e6d487288649',
    'd597ddae-6892-469a-bbc1-270e9f47a1e0',
    'd5d3774e-70b1-4fe6-84aa-3974e701cd3a',
    'd7b1a6d3-f6ea-41bd-a9c1-9c4252d74a63',
    'd9cd30a1-16dc-48aa-b161-8c6eca382c78',
    'da717fe6-c895-46a6-887d-ca902bce3013',
    'dfcb942c-0dd8-4a02-92b3-9bd9190e8ba6',
    'e0e0f8e3-7e4d-4cf1-97e1-c67884cba275',
    'e0f3e048-c161-4986-8740-455d0a7eee2b',
    'e278d90c-af2e-4898-bf62-84b5593488d9',
    'e79ae021-0393-4eb7-b8d4-e8fae9463b61',
    'f07a856b-f1f4-4ab6-ab87-9e864d335598',
    'f1a2637d-0dd7-4fb2-87d8-6d1084586fdf',
    'f38cb0bb-e13b-4b21-b9d5-ee108671d202',
    'fb7a255f-3758-416c-890f-3209497f7c64',
    'fd3ac46d-59a1-45ae-9a8a-7ed137e9c4d3'
  ]
  
async function addServices(platform_id:string) {
    try {
        await prisma.service.create({
            data:{
                name: faker.random.words(3 + Math.trunc(Math.random()*3)),
                price: Math.random()*500,
                description: faker.random.words(Math.trunc(15 + Math.random()*40)),
                platform_id
            }
        })
    } catch (error) {
        
    }
}

// ids.forEach(id => {
//     var rand = 3 + Math.trunc(Math.random()*6)
//     for (let i = 0; i < rand; i++) {
//         addServices(id)
//     }
// });



