export const uploadFiles = async (files: File[], primaryImage: File | null) => {
  const urls = [];
  const timestamp = Date.now();

  if (primaryImage) {
    const primaryImageName = `primary_${timestamp}_${primaryImage.name}`;
    const primaryImageResponse = await fetch(
      `/api/uploadImage?filename=${primaryImageName}`,
      {
        method: "POST",
        body: primaryImage,
      }
    );
    const primaryImageData = await primaryImageResponse.json();
    urls.push(primaryImageData.url);
  }

  for (const file of Array.from(files)) {
    const fileName = `${timestamp}_${file.name}`;
    const response = await fetch(`/api/uploadImage?filename=${fileName}`, {
      method: "POST",
      body: file,
    });

    const data = await response.json();
    urls.push(data.url);
  }

  return urls;
};
