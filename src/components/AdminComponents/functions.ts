export const uploadSingleFile = async (file: File) => {
  const timestamp = Date.now();
  const fileExtension = file.name.split(".").pop();
  const fileName = `${timestamp}_${Math.random()
    .toString(36)
    .slice(2, 11)}.${fileExtension}`;

  try {
    const response = await fetch(`/api/uploadImage?filename=${fileName}`, {
      method: "POST",
      body: file,
    });

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error(`Error uploading file ${file.name}:`, error);
    throw error;
  }
};

export const uploadMultipleFiles = async (files: File[]) => {
  const urls = [];
  const timestamp = Date.now();

  const generateUniqueFileName = (file: File) => {
    const fileExtension = file.name.split(".").pop();
    return `${timestamp}_${Math.random()
      .toString(36)
      .slice(2, 11)}.${fileExtension}`;
  };

  for (const file of Array.from(files)) {
    if (file.name) {
      try {
        const fileName = generateUniqueFileName(file);
        const response = await fetch(`/api/uploadImage?filename=${fileName}`, {
          method: "POST",
          body: file,
        });

        const data = await response.json();
        urls.push(data.url);
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
      }
    } else {
      console.error("File does not have a valid name.");
    }
  }

  return urls;
};
