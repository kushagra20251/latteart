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

import Settings from "@/lib/common/settings/Settings";
import {
  ActionResult,
  ActionFailure,
  ActionSuccess,
} from "@/lib/common/ActionResult";
import { RepositoryContainer } from "@/lib/eventDispatcher/RepositoryContainer";

const SAVE_SETTING_FAILED_MESSAGE_KEY = "error.common.save_settings_failed";

export class SaveSettingAction {
  constructor(
    private repositoryContainer: Pick<RepositoryContainer, "settingRepository">
  ) {}

  public async saveSettings(
    settings: Settings
  ): Promise<ActionResult<Settings>> {
    const putSettingsResult =
      await this.repositoryContainer.settingRepository.putSettings(settings);

    if (putSettingsResult.isFailure()) {
      return new ActionFailure({ messageKey: SAVE_SETTING_FAILED_MESSAGE_KEY });
    }

    return new ActionSuccess(putSettingsResult.data);
  }
}
