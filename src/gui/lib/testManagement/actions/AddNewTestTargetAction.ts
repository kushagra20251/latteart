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

import {
  ActionFailure,
  ActionResult,
  ActionSuccess,
} from "@/lib/common/ActionResult";
import { RepositoryContainer } from "@/lib/eventDispatcher/RepositoryContainer";
import { TestTarget } from "../types";

export class AddNewTestTargetAction {
  public async addNewTestTarget(
    payload: {
      testMatrixId: string;
      groupId: string;
      testTargetName: string;
    },
    repositoryContainer: Pick<RepositoryContainer, "testTargetRepository">
  ): Promise<ActionResult<TestTarget>> {
    const testTargetResult =
      await repositoryContainer.testTargetRepository.postTestTarget({
        testTargetGroupId: payload.groupId,
        name: payload.testTargetName,
      });

    if (testTargetResult.isFailure()) {
      return new ActionFailure({
        messageKey: testTargetResult.error.message ?? "",
      });
    }

    return new ActionSuccess(testTargetResult.data);
  }
}
