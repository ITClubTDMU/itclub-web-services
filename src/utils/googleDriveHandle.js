import { google } from "googleapis";
import { Readable } from "stream";
import { env } from "~/config/environment";

const SCOPE = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.file",
];

const authorize = async () => {
  const jwtClient = new google.auth.JWT(
    env.CLIENT_EMAIL,
    null,
    env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
};

const getImageDirectUrl = (fileId) => {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
};

const uploadFile = async (authClient, file, folderId) => {
  try {
    return new Promise((resolve, reject) => {
      const drive = google.drive({ version: "v3", auth: authClient });

      const fileMetaData = {
        name: file.originalname,
        mimeType: file.mimetype,
        parents: [folderId],
      };

      const buffer = new Readable();
      buffer.push(file.buffer);
      buffer.push(null);

      drive.files.create(
        {
          requestBody: fileMetaData,
          media: {
            mimeType: file.mimetype,
            body: buffer,
          },
          fields: "id, mimeType",
        },
        async function (err, file) {
          if (err) {
            return reject(new Error(err));
          }

          await drive.permissions.create({
            fileId: file.data.id,
            requestBody: {
              role: "reader",
              type: "anyone",
            },
          });

          if (file.data.mimeType.includes("image")) {
            resolve(getImageDirectUrl(file.data.id));
          } else {
            await drive.files
              .get({
                fileId: file.data.id,
                fields: "webViewLink, webContentLink",
              })
              .then((response) => {
                resolve(response.data.webViewLink);
              })
              .catch((error) => {
                reject(new Error(error.message));
              });
          }
        }
      );
    });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteFiles = async (authClient, fileIds) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });

    await Promise.all(
      fileIds.map(async (fileId) => {
        await drive.files.delete({ fileId });
      })
    );
  } catch (error) {
    throw new Error(error);
  }
};

const getFilesInFolder = async (authClient, folderId) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileIds = [];

    const fetchFiles = async (parentFolderId) => {
      let pageToken = null;

      do {
        const response = await drive.files.list({
          q: `'${parentFolderId}' in parents and trashed=false`,
          fields: "nextPageToken, files(id, name, mimeType)",
          pageToken: pageToken,
        });

        for (const file of response.data.files) {
          if (file.mimeType === "application/vnd.google-apps.folder") {
            await fetchFiles(file.id);
          } else {
            fileIds.push(file.id);
          }
        }

        pageToken = response.data.nextPageToken;
      } while (pageToken);
    };

    await fetchFiles(folderId);

    return fileIds;
  } catch (error) {
    throw new Error(error);
  }
};

const createFolder = async (authClient, folderName, parentFolderId) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });
    const fileMetaData = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };

    const response = await drive.files.create({
      requestBody: fileMetaData,
      fields: "id",
    });

    return response.data.id;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteFolder = async (authClient, folderId) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });

    const listFiles = async (folderId, nextPageToken = null) => {
      const response = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: "nextPageToken, files(id, name, mimeType)",
        pageToken: nextPageToken,
      });
      return response.data;
    };

    const deleteFile = async (fileId) => {
      await drive.files.delete({ fileId });
    };

    let pageToken = null;
    do {
      const { files, nextPageToken: newPageToken } = await listFiles(
        folderId,
        pageToken
      );
      pageToken = newPageToken;

      const deletePromises = files.map(async (file) => {
        if (file.mimeType === "application/vnd.google-apps.folder") {
          await deleteFolder(authClient, file.id);
        } else {
          await deleteFile(file.id);
        }
      });

      await Promise.all(deletePromises);
    } while (pageToken);

    await drive.files.delete({ fileId: folderId });
    // console.log(`Deleted folder: ${folderId}`);
  } catch (error) {
    throw new Error(error);
  }
};

export {
  authorize,
  uploadFile,
  deleteFiles,
  getFilesInFolder,
  createFolder,
  deleteFolder,
};
