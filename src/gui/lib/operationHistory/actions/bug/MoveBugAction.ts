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
  ActionResult,
  ActionFailure,
  ActionSuccess,
} from "@/lib/common/ActionResult";
import { Note } from "../../Note";
import { convertNoteWithoutId } from "@/lib/eventDispatcher/replyDataConverter";
import { RepositoryContainer } from "@/lib/eventDispatcher/RepositoryContainer";

const MOVE_NOTE_FAILED_MESSAGE_KEY = "error.operation_history.move_note_failed";

export class MoveBugAction {
  constructor(
    private repositoryContainer: Pick<
      RepositoryContainer,
      "noteRepository" | "testStepRepository" | "serviceUrl"
    >
  ) {}

  /**
   * Update the position where the bug is associated.
   * @param testResultId  ID of the test result associated with the bug.
   * @param from  Location of test results related to the bug.
   * @param dest  The position of the test result where you want to link the bug.
   * @returns Updated bug information.
   */
  public async moveBug(
    testResultId: string,
    from: { testStepId: string; index: number },
    dest: { testStepId: string }
  ): Promise<ActionResult<{ bug: Note; index: number }>> {
    // Break the link of the move source.
    const getTestStepsResult =
      await this.repositoryContainer.testStepRepository.getTestSteps(
        testResultId,
        from.testStepId
      );

    if (getTestStepsResult.isFailure()) {
      return new ActionFailure({ messageKey: MOVE_NOTE_FAILED_MESSAGE_KEY });
    }

    const { bugs: fromBugs } = getTestStepsResult.data;

    const filteredBugs = fromBugs.filter(
      (_: unknown, index: number) => index !== from.index
    );

    const patchTestStepsResult = await (async () => {
      return this.repositoryContainer.testStepRepository.patchTestSteps(
        testResultId,
        from.testStepId,
        undefined,
        filteredBugs
      );
    })();

    if (patchTestStepsResult.isFailure()) {
      return new ActionFailure({ messageKey: MOVE_NOTE_FAILED_MESSAGE_KEY });
    }

    // Link to the destination.
    const getTestStepsResult2 =
      await this.repositoryContainer.testStepRepository.getTestSteps(
        testResultId,
        dest.testStepId
      );

    if (getTestStepsResult2.isFailure()) {
      return new ActionFailure({ messageKey: MOVE_NOTE_FAILED_MESSAGE_KEY });
    }

    const { bugs: destBugs } = getTestStepsResult2.data;

    const bugs = [...destBugs, fromBugs[from.index]];

    const patchTestSteps2 =
      await this.repositoryContainer.testStepRepository.patchTestSteps(
        testResultId,
        dest.testStepId,
        undefined,
        bugs
      );

    if (patchTestSteps2.isFailure()) {
      return new ActionFailure({ messageKey: MOVE_NOTE_FAILED_MESSAGE_KEY });
    }

    const getNotesResult =
      await this.repositoryContainer.noteRepository.getNotes(
        testResultId,
        fromBugs[from.index]
      );

    if (getNotesResult.isFailure()) {
      return new ActionFailure({ messageKey: MOVE_NOTE_FAILED_MESSAGE_KEY });
    }

    const note = getNotesResult.data;

    const serviceUrl = this.repositoryContainer.serviceUrl;
    const data = {
      bug: convertNoteWithoutId(note, serviceUrl),
      index: destBugs.length,
    };

    return new ActionSuccess(data);
  }
}
