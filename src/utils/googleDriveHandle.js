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
    )
  } catch (error) {
    throw new Error(error);
  }
};

const getFilesInFolder = async (authClient, folderId) => {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });

    const result = [];
    let pageToken = null;

    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: "nextPageToken, files(id, name)",
        pageToken: pageToken,
      });

      response.data.files.forEach((file) => result.push(file.id));
      pageToken = response.data.nextPageToken;
    } while (pageToken);

    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export { authorize, uploadFile, deleteFiles, getFilesInFolder };
