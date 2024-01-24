import {
  ListBucketsCommand,
  ListObjectsV2Command,
  S3Client,
} from "@aws-sdk/client-s3";
import express from "express";

const client = new S3Client({});
const router = express.Router();
// const bucketName = "dynamis-publicsite"

// GET /
// Express ルータ動作確認
router.get("/", async function (req, res, next) {
  res.send("respond with a resource");
});

// GET /storage/buckets
// バケット名リスト情報を返す
router.get("/buckets", async function (req, res, next) {
  // S3 操作のコード list-buckets.js から引用して使う
  const command = new ListBucketsCommand({});

  try {
    const { Owner, Buckets } = await client.send(command);
    console.log(
      `${Owner.DisplayName} owns ${Buckets.length} bucket${
        Buckets.length === 1 ? "" : "s"
      }:`
    );
    console.log(`${Buckets.map((b) => ` • ${b.Name}`).join("\n")}`);
    let bucketNameList = Buckets.map((bucket) => bucket.Name);
    res.send(JSON.stringify(bucketNameList));
  } catch (err) {
    console.error(err);
    res.send(`ERROR: ${err}`);
  }
});

// GET /storage/<bucket>/files
// 指定バケット名配下のファイルリストを返す
router.get("/:bucket/files", async function (req, res, next) {
  const bucketName = req.params.bucket;
  const command = new ListObjectsV2Command({
    Bucket: bucketName,
    // The default and maximum number of keys returned is 1000. This limits it to
    // one for demonstration purposes.
    MaxKeys: 1,
  });

  try {
    let isTruncated = true;

    console.log("Your bucket contains the following objects:\n");
    let contents = "file list: <ul>";

    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } =
        await client.send(command);
      const contentsList = Contents.map((c) => `<li> ${c.Key}`).join("</br>");
      contents += contentsList + "</br>";
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    contents += "</ul>";
    console.log(contents);
    res.send(contents);
  } catch (err) {
    console.error(err);
    res.send(`ERROR: ${err}`);
  }

  res.send("respond with a resource");
});

// GET /storage/<bucket>/file/<filename>
// 指定バケット名、ファイル名のファイルを返す
router.get("/:bucket/file/:filename", async function (req, res, next) {
  res.send("respond with a resource");
});

export { router as default };
