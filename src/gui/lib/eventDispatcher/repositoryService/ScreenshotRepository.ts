/**
 * Copyright 2022 NTT Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { RESTClient } from "../RESTClient";
import {
  RepositoryAccessResult,
  RepositoryAccessSuccess,
  createRepositoryAccessFailure,
  createConnectionRefusedFailure,
} from "@/lib/captureControl/Reply";

export class ScreenshotRepository {
  constructor(private restClient: RESTClient) {}

  /**
   * Get screenshots of the specified test result.
   * @param testResultId  Test Result ID.
   * @returns URL of the screenshots archive.
   */

  public async getScreenshots(
    testResultId: string
  ): Promise<RepositoryAccessResult<{ url: string }>> {
    try {
      const response = await this.restClient.httpGet(
        `/test-results/${testResultId}/screenshots`
      );

      if (response.status !== 200) {
        return createRepositoryAccessFailure(response);
      }

      return new RepositoryAccessSuccess({
        data: response.data as { url: string },
      });
    } catch (error) {
      return createConnectionRefusedFailure();
    }
  }
}
