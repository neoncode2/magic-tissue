'use client';

import WheelColorField from '@/components/admin/WheelColorField';

function StatPill({ label, value }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-3">
      <div className="text-xs font-black uppercase tracking-[0.16em] text-gray-500">{label}</div>
      <div className="mt-2 text-xl font-black text-white">{value}</div>
    </div>
  );
}

export default function SpinAdminPanel({
  inputClass,
  spinOptions,
  setSpinOptions,
  spinConfig,
  setSpinConfig,
  spinAnalytics,
  newSpinOption,
  setNewSpinOption,
  onUploadImage,
  saveSpinConfig,
  createSpinOption,
  patchSpinOption,
  deleteSpinOption,
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-white/10 bg-[#111111] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-white">Spin Popup Settings</h2>
            <p className="mt-2 text-sm leading-6 text-gray-400">
              Control popup timing, appearance probability, exit-intent behavior, the side image, and force-result mode.
            </p>
          </div>
          <button
            type="button"
            onClick={saveSpinConfig}
            className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white"
          >
            Save Spin Settings
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
            <input
              type="checkbox"
              checked={spinConfig.popupEnabled}
              onChange={(event) => setSpinConfig((prev) => ({ ...prev, popupEnabled: event.target.checked }))}
            />
            Popup enabled
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
            <input
              type="checkbox"
              checked={spinConfig.exitIntentEnabled}
              onChange={(event) => setSpinConfig((prev) => ({ ...prev, exitIntentEnabled: event.target.checked }))}
            />
            Exit intent enabled
          </label>
          <input
            className={inputClass}
            type="number"
            min="0"
            value={spinConfig.minDelaySeconds}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, minDelaySeconds: Number(event.target.value) }))}
            placeholder="Min popup delay (seconds)"
          />
          <input
            className={inputClass}
            type="number"
            min="0"
            value={spinConfig.maxDelaySeconds}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, maxDelaySeconds: Number(event.target.value) }))}
            placeholder="Max popup delay (seconds)"
          />
          <input
            className={inputClass}
            type="number"
            min="5"
            value={spinConfig.reappearDelaySeconds ?? 30}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, reappearDelaySeconds: Number(event.target.value) }))}
            placeholder="Reappear delay after close/spin (seconds)"
          />
          <input
            className={inputClass}
            type="number"
            min="0"
            max="1"
            step="0.05"
            value={spinConfig.showProbability}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, showProbability: Number(event.target.value) }))}
            placeholder="Probability (0 to 1)"
          />
          <select
            className={inputClass}
            value={spinConfig.forceResultOptionId || ''}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, forceResultOptionId: event.target.value || null }))}
          >
            <option value="">Random result</option>
            {spinOptions.map((option) => (
              <option key={option._id} value={option._id}>
                Force: {option.label}
              </option>
            ))}
          </select>
          <input
            className={inputClass}
            value={spinConfig.popupTitle}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, popupTitle: event.target.value }))}
            placeholder="Popup title"
          />
          <input
            className={inputClass}
            value={spinConfig.popupButtonText}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, popupButtonText: event.target.value }))}
            placeholder="Spin button text"
          />
          <textarea
            className={`${inputClass} min-h-28 lg:col-span-2`}
            value={spinConfig.popupSubtitle}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, popupSubtitle: event.target.value }))}
            placeholder="Popup subtitle"
          />
          <input
            className={`${inputClass} lg:col-span-2`}
            value={spinConfig.sideImageUrl}
            onChange={(event) => setSpinConfig((prev) => ({ ...prev, sideImageUrl: event.target.value }))}
            placeholder="Side image URL"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white">
            Upload Side Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                onUploadImage(file, (url) => setSpinConfig((prev) => ({ ...prev, sideImageUrl: url })));
                event.target.value = '';
              }}
            />
          </label>
          {spinConfig.sideImageUrl ? (
            <div className="overflow-hidden rounded-[20px] border border-white/10 bg-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={spinConfig.sideImageUrl} alt="Spin side preview" className="h-20 w-20 object-cover" />
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#111111] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">Spin Analytics</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">See total spins, consumed discounts, and recent reward usage.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatPill label="Total Spins" value={spinAnalytics.totalSpins || 0} />
          <StatPill label="Consumed" value={spinAnalytics.consumedSpins || 0} />
          <StatPill label="Available" value={spinAnalytics.availableSpins || 0} />
          <StatPill label="Rewarded Orders" value={spinAnalytics.rewardedOrders || 0} />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-gray-500">Reward Breakdown</div>
            <div className="mt-4 space-y-3">
              {(spinAnalytics.rewardBreakdown || []).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
                  <span>{item.label}</span>
                  <span className="font-black">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="text-sm font-black uppercase tracking-[0.18em] text-gray-500">Recent Spins</div>
            <div className="mt-4 space-y-3">
              {(spinAnalytics.recentSpins || []).map((spin) => (
                <div key={spin._id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-bold text-white">{spin.rewardLabel || 'Reward'}</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.16em] text-gray-500">{spin.userId}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${spin.used ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-200'}`}>
                      {spin.used ? 'Used' : 'Available'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-white/10 bg-[#111111] p-5 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">Spin Rewards</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">Add, update, delete, and rebalance wheel rewards and probabilities.</p>
        </div>

        <div className="mb-6 space-y-4 rounded-[24px] border border-dashed border-white/10 bg-black/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Label</div>
              <input
                className={`${inputClass} mt-2`}
                value={newSpinOption.label}
                onChange={(event) => setNewSpinOption((prev) => ({ ...prev, label: event.target.value }))}
                placeholder="Reward label"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Type</div>
              <select
                className={`${inputClass} mt-2`}
                value={newSpinOption.type}
                onChange={(event) => setNewSpinOption((prev) => ({ ...prev, type: event.target.value }))}
              >
                <option value="percentage">percentage</option>
                <option value="fixed">fixed</option>
                <option value="none">none</option>
              </select>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Value</div>
              <input
                className={`${inputClass} mt-2`}
                type="number"
                min="0"
                value={newSpinOption.value}
                onChange={(event) => setNewSpinOption((prev) => ({ ...prev, value: Number(event.target.value) }))}
                placeholder="Value"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Weight</div>
              <input
                className={`${inputClass} mt-2`}
                type="number"
                min="0"
                value={newSpinOption.probability}
                onChange={(event) => setNewSpinOption((prev) => ({ ...prev, probability: Number(event.target.value) }))}
                placeholder="Probability"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={createSpinOption}
                className="w-full rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white"
              >
                Add Reward
              </button>
            </div>
          </div>
          <WheelColorField
            label="Wheel segment color"
            value={newSpinOption.color}
            onChange={(hex) => setNewSpinOption((prev) => ({ ...prev, color: hex }))}
          />
        </div>

        <div className="space-y-4">
          {spinOptions.map((option) => (
            <div key={option._id} className="space-y-4 rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Label</div>
                  <input
                    className={`${inputClass} mt-2`}
                    value={option.label}
                    onChange={(event) =>
                      setSpinOptions((prev) =>
                        prev.map((item) => (item._id === option._id ? { ...item, label: event.target.value } : item)),
                      )
                    }
                  />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Type</div>
                  <select
                    className={`${inputClass} mt-2`}
                    value={option.type}
                    onChange={(event) =>
                      setSpinOptions((prev) =>
                        prev.map((item) => (item._id === option._id ? { ...item, type: event.target.value } : item)),
                      )
                    }
                  >
                    <option value="percentage">percentage</option>
                    <option value="fixed">fixed</option>
                    <option value="none">none</option>
                  </select>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Value</div>
                  <input
                    className={`${inputClass} mt-2`}
                    type="number"
                    min="0"
                    value={option.value}
                    onChange={(event) =>
                      setSpinOptions((prev) =>
                        prev.map((item) => (item._id === option._id ? { ...item, value: Number(event.target.value) } : item)),
                      )
                    }
                  />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Weight</div>
                  <input
                    className={`${inputClass} mt-2`}
                    type="number"
                    min="0"
                    value={option.probability}
                    onChange={(event) =>
                      setSpinOptions((prev) =>
                        prev.map((item) =>
                          item._id === option._id ? { ...item, probability: Number(event.target.value) } : item,
                        ),
                      )
                    }
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => patchSpinOption(option)}
                    className="min-h-[48px] flex-1 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSpinOption(option._id)}
                    className="min-h-[48px] rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <WheelColorField
                label="Wheel segment color"
                value={option.color || ''}
                onChange={(hex) =>
                  setSpinOptions((prev) => prev.map((item) => (item._id === option._id ? { ...item, color: hex } : item)))
                }
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
