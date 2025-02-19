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
  RepositoryAccessResult,
  RepositoryAccessSuccess,
  createRepositoryAccessFailure,
  createConnectionRefusedFailure,
} from "@/lib/captureControl/Reply";
import {
  TestStepOperation,
  CoverageSource,
  InputElementInfo,
} from "@/lib/operationHistory/types";
import { RESTClient } from "../RESTClient";
import { CapturedOperation } from "@/lib/operationHistory/CapturedOperation";

export interface TestStepRepository {
  getTestSteps(
    testResultId: string,
    testStepId: string
  ): Promise<
    RepositoryAccessResult<{
      id: string;
      operation: TestStepOperation;
      intention: string | null;
      bugs: string[];
      notices: string[];
    }>
  >;

  patchTestSteps(
    testResultId: string,
    testStepId: string,
    noteId?: string | null,
    bugs?: string[],
    notices?: string[]
  ): Promise<
    RepositoryAccessResult<{
      id: string;
      operation: TestStepOperation;
      intention: string | null;
      bugs: string[];
      notices: string[];
    }>
  >;

  postTestSteps(
    testResultId: string,
    capturedOperation: CapturedOperation
  ): Promise<
    RepositoryAccessResult<{
      id: string;
      operation: TestStepOperation;
      coverageSource: CoverageSource;
      inputElementInfo: InputElementInfo;
    }>
  >;
}

export class TestStepRepositoryImpl implements TestStepRepository {
  constructor(private restClient: RESTClient) {}

  public async getTestSteps(
    testResultId: string,
    testStepId: string
  ): Promise<
    RepositoryAccessResult<{
      id: string;
      operation: TestStepOperation;
      intention: string | null;
      bugs: string[];
      notices: string[];
    }>
  > {
    try {
      const response = await this.restClient.httpGet(
        `/test-results/${testResultId}/test-steps/${testStepId}`
      );

      if (response.status !== 200) {
        return createRepositoryAccessFailure(response);
      }

      return new RepositoryAccessSuccess({
        data: response.data as {
          id: string;
          operation: TestStepOperation;
          intention: string | null;
          bugs: string[];
          notices: string[];
        },
      });
    } catch (error) {
      return createConnectionRefusedFailure();
    }
  }

  public async patchTestSteps(
    testResultId: string,
    testStepId: string,
    noteId?: string | null,
    bugs?: string[],
    notices?: string[]
  ): Promise<
    RepositoryAccessResult<{
      id: string;
      operation: TestStepOperation;
      intention: string | null;
      bugs: string[];
      notices: string[];
    }>
  > {
    try {
      const body = notices
        ? { notices }
        : bugs
        ? { bugs }
        : { intention: noteId };
      const response = await this.restClient.httpPatch(
        `/test-results/${testResultId}/test-steps/${testStepId}`,
        body
      );

      if (response.status !== 200) {
        return createRepositoryAccessFailure(response);
      }

      return new RepositoryAccessSuccess({
        data: response.data as {
          id: string;
          operation: TestStepOperation;
          intention: string | null;
          bugs: string[];
          notices: string[];
        },
      });
    } catch (error) {
      return createConnectionRefusedFailure();
    }
  }

  public async postTestSteps(
    testResultId: string,
    capturedOperation: CapturedOperation
  ): Promise<
    RepositoryAccessResult<{
      id: string;
      operation: TestStepOperation;
      coverageSource: CoverageSource;
      inputElementInfo: InputElementInfo;
    }>
  > {
    try {
      const response = await this.restClient.httpPost(
        `/test-results/${testResultId}/test-steps`,
        capturedOperation
      );

      if (response.status !== 200) {
        return createRepositoryAccessFailure(response);
      }

      return new RepositoryAccessSuccess({
        data: response.data as {
          id: string;
          operation: TestStepOperation;
          coverageSource: CoverageSource;
          inputElementInfo: InputElementInfo;
        },
      });
    } catch (error) {
      return createConnectionRefusedFailure();
    }
  }
}
