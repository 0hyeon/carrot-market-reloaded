"server";
export async function uploadProduct(fromData: FormData) {
  const data = {
    photo: fromData.get("photo"),
    title: fromData.get("title"),
    price: fromData.get("price"),
    description: fromData.get("description"),
  };
  console.log(data);
}
