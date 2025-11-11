import React from 'react';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Select from '../form/Select';
interface ModalProps {
    onClose: () => void;
}
const CreateUsers : React.FC<ModalProps> = ({ onClose })=> {
    const organizations= [
        { id: 1, name: "AutoCorp GmbH", totalUsers: 24, totalProtections: 12 },
        { id: 2, name: "DriveTech Innovations", totalUsers: 15, totalProtections: 8 },
        { id: 3, name: "SpeedMotors AG", totalUsers: 40, totalProtections: 23 },
        { id: 4, name: "TorqueWorks", totalUsers: 9, totalProtections: 3 },
        { id: 5, name: "MotionX Industries", totalUsers: 32, totalProtections: 14 },
    ];
  return (
   <div>
            <div className="relative w-full rounded-3xl bg-white dark:bg-gray-900 p-5 lg:p-10">
                <button
                    onClick={onClose}
                    className="absolute right-3 top-3 z-999 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>

                {/* Form */}
                <form>
                    <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90 w-full">
                        User Information
                    </h4>

                    <div className="space-y-5">

                        <div>
                            <Label>
                                  Name
                            </Label>
                            <Input
                                type="text"
                                placeholder="Emirhan"
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                            />
                        </div>
                        <div>
                            <Label>
                                Email 
                            </Label>
                            <Input
                                type="email"
                                placeholder="Emirhan@gmail.com"
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                            />
                        </div>
                        <div>
                            <Label>
                                Password  
                            </Label>
                            <Input
                                type="Password"
                                placeholder="............"
                                className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:border-gray-700 dark:focus:border-brand-800"
                            />
                        </div>
                        <div>
                            <Label>
                                Assign Organization
                            </Label>
                            <Select
                        className="w-full"
                            options={[ 
                                ...organizations.map((org) => ({
                                    value: String(org.id),
                                    label: org.name,
                                })),
                            ]}
                            onChange={()=>{}}
                            placeholder="Assign Organization" 
                            defaultValue=""
                        />
                        </div>
                        <div>
                            <Label>
                                Assign Role
                            </Label>
                            <Select
                        className="w-full"
                            options={[ 
                                 {
                                    value: "Org_admin",
                                    label: "Org Admin",
                                } ,
                                 {
                                    value: "user",
                                    label: "User",
                                } ,
                            ]}
                            onChange={()=>{}}
                            placeholder="Assign Organization" 
                            defaultValue=""
                        />
                        </div>





                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end w-full gap-3 mt-6">
                        <button
                            onClick={onClose}
                            type="button"
                            className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300"
                        >
                            Close
                        </button>
                        <button
                            onClick={onClose}
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
  );
}

export default CreateUsers;
