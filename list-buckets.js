// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ListBucketsCommand } from "@aws-sdk/client-s3";
import { client } from "./client.js";

async function lbmain() {
  const command = new ListBucketsCommand({});

  try {
    const { Owner, Buckets } = await client.send(command);
    console.log(
      `${Owner.DisplayName} owns ${Buckets.length} bucket${
        Buckets.length === 1 ? "" : "s"
      }:`
    );
    console.log(`${Buckets.map((b) => ` • ${b.Name}`).join("\n")}`);
  } catch (err) {
    console.error(err);
  }
}
// snippet-end:[s3.JavaScript.buckets.listBucketsV3]

// Invoke main function if this file was run directly.
// if (process.argv[1] === fileURLToPath(import.meta.url)) {
//   main();
// }
