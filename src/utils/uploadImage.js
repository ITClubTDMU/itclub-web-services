import { google } from "googleapis";
import { Readable } from "stream";

const SCOPE = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.file",
];

const authorize = async () => {
  const jwtClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL,
    null,
    process.env.PRIVATE_KEY.replace(/\\n/gm, "\n"),
    SCOPE
  );

  await jwtClient.authorize();

  return jwtClient;
};

const getImageDirectUrl = (fileId) => {
  return `https://lh3.googleusercontent.com/d/${fileId}`;
};

const uploadFile = async (authClient, file, folderId) => {
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
};

export { authorize, uploadFile };
