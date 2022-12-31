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

// for (let i = 0; i < 50; i++) {
//     addCompany()
// }


async function getPlatformIds() {
    const request = await prisma.platform.findMany({
        select:{id:true},
        take:100
    })
    const idArray: string[] = request.map(item => item.id);
    console.log(idArray)
}

// getPlatformIds()

const ids = [
    '01bba111-e123-4a6c-a012-0395535c8f15',
    '07bc62fa-bed3-4784-8c35-859839eb7420',
    '08367843-b229-4968-b9ed-6a79d1d4fcb5',
    '08b6ede5-7c27-4c60-88d2-5447d1b9c30b',
    '09b36d1b-edd0-446e-a398-59acf07f8a4e',
    '10b4ee93-c330-4e4f-a55a-d71d92d44029',
    '13f09d2c-d374-4854-b662-3b9c6a2fa97e',
    '155af8fc-13ab-49dd-bf25-08e64b7e6b2d',
    '19276858-ff95-4697-9a87-673774b044a4',
    '1cc4a82b-719e-422a-94c7-652d36a87a32',
    '2960f015-53ca-423d-826f-5adf0c188160',
    '2cfca254-9fd6-40c9-b34d-6d1c0ad0814e',
    '2d392309-43a4-440c-a6cd-0d3969747d2f',
    '2d692836-0b2f-4103-8575-afda97e831c5',
    '2fbbeb07-99f2-4785-a439-673fa933ba01',
    '3189dca4-4d58-4ba1-b6d6-a8bc645e4c3a',
    '334000a5-0bf4-4369-9277-b4cbe0d60995',
    '34503cf7-f715-4461-8b34-27c93a9c5a80',
    '356a815a-b7b1-461e-b332-e573946f830f',
    '35705768-bd5d-41a3-9f42-2726e5d74b98',
    '36ea198c-e45f-4e26-9939-e8b167ff2821',
    '3750fdbd-7919-42fb-a657-44705c6971e8',
    '37b33b78-b507-4496-9d90-23f2ad7717a9',
    '38d5aed6-6103-46f0-b72f-4f0881d92372',
    '39a1b83c-4208-4a17-b84f-f1722a452ef8',
    '3d3e9557-4758-4ae8-a3af-9ce2b4a331d3',
    '44507ab1-cc42-4db8-b71a-4b1c8a144c09',
    '46cdcf1b-fac0-427c-b00d-52b98f56c96c',
    '4777b115-496d-4946-a839-154cc8a88fe4',
    '47db8df9-39dc-4faa-b342-7f2d95b24df9',
    '488a8784-a20b-4a6d-9a97-706463e76260',
    '49894109-f38d-404c-bde1-fdc98ba83d5b',
    '4c346c76-8e9f-422f-bd5f-60b4578b11ea',
    '4e417096-e55f-4be1-a9fe-00c4bcbb661f',
    '51143c6a-741f-4595-8afc-908f37fe784f',
    '52f51825-dcca-460c-b611-f0eb71b73712',
    '54e7ca9d-c83f-4986-aa22-24aa573b6fcf',
    '562ce65f-73eb-4d3f-9d0c-4027cf846809',
    '579c5447-8214-4f9e-93ba-6f52bfaccb9d',
    '58140abb-4320-40e9-8b0e-48ad161b228e',
    '584ee424-685b-4125-abd1-119ed0e0ab29',
    '5d09a7cc-4b2c-499f-982a-5732f1b70753',
    '5f6b6e0d-1739-43ec-b5ec-f30a68cabc1a',
    '613c7088-6d01-431f-b20e-2110b026a162',
    '6bd1c6e1-fa99-4c90-a417-09b3a9b048fd',
    '6e083fbe-4b84-4736-be93-a9b644375949',
    '6e6e01f5-6dc0-4459-992c-9e0a2ae3e2f3',
    '710c58c5-8a43-412f-8864-244f3f9448d2',
    '7363876d-b40b-4c42-ae5a-08bc7f9d6d61',
    '7374a56a-45de-41dc-972d-4f2be95e2841',
    '74ce3877-e32f-411c-9658-926ef99d6245',
    '7804ed63-13ad-4576-9391-acc5dda6ae31',
    '7a0a96b7-303e-4542-926d-c01a78f4cc1a',
    '7a40508f-f24c-4653-8a4b-723bebef88f4',
    '7aefbde3-0250-4590-a57a-4ea01f5a7e5f',
    '8264b3f7-853f-4988-9c8f-996379386a2f',
    '840375ac-3e6d-45af-8e1f-27d501c2d2a4',
    '86557c57-5374-440e-89ab-c6c9714e9094',
    '8915c742-32d2-49ec-8fba-3a98c0ceea27',
    '89c32ef2-71ef-43f4-b93a-60ff173b4871',
    '90808ce7-fbc3-4fbb-b5db-04015986c977',
    '953bf1a0-e088-40ae-a769-297cde104473',
    '97138e02-e4bc-4d83-90ab-207d4b0dfcdc',
    '9efe3046-2304-403f-9c19-c007235430be',
    'a067d3fd-c481-4b96-b30c-51002569b2cd',
    'a3ae7ac8-898f-45eb-b353-f573c5591832',
    'a448739c-bc1f-4b62-a3d3-c0f8d628679f',
    'ac159410-e61d-4d34-b9fb-3855737713dd',
    'ae8566d0-5851-4f9d-849c-1ffb3f1611d7',
    'b11c8141-98d9-4894-8a0f-2c86026d24e0',
    'b527c286-859e-4562-8462-6b2ab7316ef6',
    'b5edd245-a787-49cf-8d4b-2cf8cd897bcd',
    'bace0d34-6ab4-4697-8356-74b8f1e28b32',
    'beeb350c-0222-4f21-98a6-0d1f4c80d043',
    'bfbd603a-33ed-4289-9206-e8a41fdb24bc',
    'bfdb7ce1-ba17-425a-b44a-93e43c32fe7e',
    'c603fa43-bffc-4276-9f2c-5c1a28deba18',
    'ca120f37-6409-4902-9277-bc93c85767e6',
    'ca31822c-c78b-4ecf-8d9f-62afc2360822',
    'cde58627-bd9d-4e99-99de-964d901309e7',
    'cf4ac595-a27b-4c7e-a366-87f7cf886847',
    'd0699706-6b2c-4a02-bc15-00467845d616',
    'd30998ed-3ac3-4330-a7aa-7b10bdfcf0da',
    'd744e918-098b-4084-ab1b-af14ff44a9c8',
    'dc0e0389-4ab2-4fbf-833c-b54b3eaa85a3',
    'dc6d3fcb-58c9-4385-83be-54a83ed1e021',
    'dcaf0bd7-b96c-44f6-9628-0822604e3616',
    'de8ed525-9b88-4396-b28b-e6edb1d4e17b',
    'df8cf491-0437-40f2-8bf7-84a3e3c306d9',
    'e10d2a33-c492-4113-ac95-19c862b53720',
    'e316ac00-063c-458e-b8b0-4aae2669aa84',
    'e3fc1163-5400-4af9-9782-a9ee9fd2536c',
    'e48fd1c4-7d6c-446c-b67d-786a4b51c68d',
    'e872fb20-49c0-452e-8880-1c7a408eb7af',
    'e887aeb0-306e-49d8-9d08-d90a47454d66',
    'e8a795fe-2123-4e5c-af55-1f81a6405cce',
    'ebfd468e-9524-41dd-9d6f-b8f7f3165603',
    'f3b4459d-ba2b-454d-bb99-06b1262466a0',
    'fa245edd-3fd1-4a6a-a923-fde27211369b',
    'fd172022-d56d-4ea1-b602-32fa04d126c0'
]
  
async function addServices(platform_id:string) {
    try {
        await prisma.service.create({
            data:{
                name: faker.random.words(Math.trunc(Math.random()*6)),
                price: Math.random()*500,
                description: faker.random.words(Math.trunc(15 + Math.random()*40)),
                platform_id
            }
        })
    } catch (error) {
        
    }
}

ids.forEach(id => {
    var rand = Math.trunc(Math.random()*6)
    for (let i = 0; i < rand; i++) {
        addServices(id)
    }
});


