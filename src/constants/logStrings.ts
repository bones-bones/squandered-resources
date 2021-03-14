export const LAME_ERROR = `When used with builtin render pipeline, Postprocessing package expects to be used on a fullscreen Camera.
Please note that using Camera viewport may result in visual artefacts or some things not working.
UnityEngine.Rendering.PostProcessing.PostProcessLayer:OnPreCull()
 
(Filename: ./Runtime/Export/Debug/Debug.bindings.h Line: 35)

`;

export const escapeRegExp = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&').replace(/\n/g, '\\n'); // $& means the whole matched string
};
